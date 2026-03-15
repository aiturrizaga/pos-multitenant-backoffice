import { Component, inject, OnInit, signal } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { TerminalApi } from '@/core/services/terminal/terminal-api';
import { TerminalResponse } from '@/core/interfaces/terminal';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SaveTerminalDlg } from '@/feature/terminal/components/save-terminal-dlg/save-terminal-dlg';

@Component({
  selector: 'app-terminal-list-page',
  imports: [
    ButtonModule,
    ConfirmDialogModule,
    TableModule,
    TagModule
  ],
  providers: [DialogService, ConfirmationService],
  templateUrl: './terminal-list-page.html',
  styles: ``,
})
export class TerminalListPage implements OnInit {
  #dialogService = inject(DialogService);
  first = 0;
  rows = 10;
  #terminalApi = inject(TerminalApi);
  #confirmationService = inject(ConfirmationService);
  terminals = signal<TerminalResponse[]>([]);

  ngOnInit(): void {
    this.getTerminals();
  }

  pageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
  }

  getTerminals(): void {
    this.#terminalApi.getAll({ sort: 'id,desc' }).subscribe(res => {
      if (res && res.data && res.data.content) {
        this.terminals.set(res.data.content);
      }
    })
  }

  confirmInactiveTerminal(terminal: TerminalResponse): void {
    this.#confirmationService.confirm({
      message: '¿Estas eguro de inactivar esta terminal?',
      header: 'Inactivar terminal',
      icon: 'ti ti-alert-square-rounded',
      rejectLabel: 'Cancelar',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Inactivar',
        severity: 'danger',
      },

      accept: () => {
        this.deactivateTerminal(terminal.id);
      }
    });
  }

  private deactivateTerminal(terminalId: number): void {
    this.#terminalApi.deactivate(terminalId).subscribe(res => {
      this.getTerminals();
    });
  }

  openSaveTerminalDlg(terminal?: TerminalResponse): void {
    const ref = this.#dialogService.open(SaveTerminalDlg, {
      header: terminal ? 'Actualizar terminal' : 'Nueva terminal',
      data: terminal,
      modal: true,
      closable: true,
      closeOnEscape: true,
      width: '30vw',
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
    });

    ref?.onClose.subscribe(res => {
      if (res) {
        this.getTerminals();
      }
    })
  }
}
