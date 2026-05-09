import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { buildCopayBreakdown } from '../../../../core/application/services/copay-breakdown.service';
import { EstimateCareUseCase } from '../../../../core/application/use-cases/estimate-care.use-case';
import { CareEstimate, CopayBreakdown } from '../../../../core/domain/entities/care-estimate.entity';

type ConsultationStep = 'identity' | 'symptoms' | 'result';
type ChatSender = 'agent' | 'patient';

interface ChatMessage {
  id: number;
  sender: ChatSender;
  text: string;
}

interface QuickSymptom {
  label: string;
  text: string;
}

@Component({
  selector: 'app-copay-assistant-page',
  imports: [ReactiveFormsModule],
  templateUrl: './copay-assistant-page.html',
  styleUrl: './copay-assistant-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopayAssistantPage {
  @ViewChild('chatThread') private chatThread?: ElementRef<HTMLElement>;

  private readonly estimateCare = inject(EstimateCareUseCase);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly form = new FormGroup({
    documentNumber: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4)],
    }),
    symptomText: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5)],
    }),
  });

  protected readonly step = signal<ConsultationStep>('identity');
  protected readonly estimate = signal<CareEstimate | null>(null);
  protected readonly isLoading = signal(false);
  protected readonly messages = signal<ChatMessage[]>([
    {
      id: 1,
      sender: 'agent',
      text: 'Hola, soy tu agente de cobertura. Ingresa tu cédula o número de póliza para iniciar.',
    },
  ]);
  protected readonly quickSymptoms: QuickSymptom[] = [
    {
      label: 'Garganta y fiebre',
      text: 'Tengo dolor de garganta, fiebre y malestar general.',
    },
    {
      label: 'Pecho y respiración',
      text: 'Tengo dolor en el pecho y me cuesta respirar.',
    },
    {
      label: 'Dolor abdominal',
      text: 'Tengo dolor abdominal fuerte, náuseas y ardor estomacal.',
    },
    {
      label: 'Migraña intensa',
      text: 'Tengo dolor de cabeza intenso, mareos y sensibilidad a la luz.',
    },
    {
      label: 'Lesión de rodilla',
      text: 'Me torcí la rodilla, tengo dolor al caminar e inflamación.',
    },
  ];

  protected readonly breakdown = computed<CopayBreakdown | null>(() => {
    const estimate = this.estimate();
    return estimate ? buildCopayBreakdown(estimate) : null;
  });

  protected readonly progress = computed(() => {
    if (this.step() === 'identity') {
      return 33;
    }

    if (this.step() === 'symptoms') {
      return 66;
    }

    return 100;
  });

  protected submitDocument(): void {
    const control = this.form.controls.documentNumber;
    control.markAsTouched();

    if (control.invalid) {
      return;
    }

    const documentNumber = control.value.trim();
    this.pushMessage('patient', documentNumber);
    this.pushMessage(
      'agent',
      'Listo. Ahora describe tus síntomas con tus propias palabras y reviso tu cobertura.',
    );
    this.step.set('symptoms');
  }

  protected submitSymptoms(): void {
    const symptomControl = this.form.controls.symptomText;
    const documentControl = this.form.controls.documentNumber;
    symptomControl.markAsTouched();
    documentControl.markAsTouched();

    if (symptomControl.invalid || documentControl.invalid || this.isLoading()) {
      return;
    }

    const symptomText = symptomControl.value.trim();
    this.pushMessage('patient', symptomText);
    this.pushMessage(
      'agent',
      'Estoy analizando tus síntomas, validando tu cobertura y comparando hospitales disponibles.',
    );
    this.isLoading.set(true);

    this.estimateCare
      .execute({
        documentNumber: documentControl.value,
        symptomText,
      })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe((estimate) => {
        this.estimate.set(estimate);
        this.step.set('result');
        this.pushMessage(
          'agent',
          `Por los síntomas ingresados, la especialidad sugerida es ${estimate.interpretation.specialtyName}. La mejor opción económica es ${estimate.recommendation.hospitalName}.`,
        );
      });
  }

  protected useQuickSymptom(symptom: string): void {
    this.form.controls.symptomText.setValue(symptom);
  }

  protected resetFlow(): void {
    this.form.reset({
      documentNumber: '',
      symptomText: '',
    });
    this.step.set('identity');
    this.estimate.set(null);
    this.isLoading.set(false);
    this.messages.set([
      {
        id: Date.now(),
        sender: 'agent',
        text: 'Hola, soy tu agente de cobertura. Ingresa tu cédula o número de póliza para iniciar.',
      },
    ]);
  }

  protected formatMoney(amount: number, currency: string | null | undefined): string {
    const normalizedCurrency = currency?.trim().toUpperCase();

    if (!normalizedCurrency || normalizedCurrency === '$' || normalizedCurrency === 'USD') {
      return `$${amount.toFixed(2)}`;
    }

    try {
      return new Intl.NumberFormat('es-EC', {
        style: 'currency',
        currency: normalizedCurrency,
      }).format(amount);
    } catch {
      return `${currency} ${amount.toFixed(2)}`;
    }
  }

  protected trackByMessage(_: number, message: ChatMessage): number {
    return message.id;
  }

  protected trackByHospital(_: number, hospital: { hospitalId: string }): string {
    return hospital.hospitalId;
  }

  private pushMessage(sender: ChatSender, text: string): void {
    this.messages.update((messages) => [
      ...messages,
      {
        id: Date.now() + messages.length,
        sender,
        text,
      },
    ]);
    this.scrollChatToBottom();
  }

  private scrollChatToBottom(): void {
    setTimeout(() => {
      const element = this.chatThread?.nativeElement;
      if (!element) {
        return;
      }

      element.scrollTo({
        top: element.scrollHeight,
        behavior: 'smooth',
      });
    });
  }
}
