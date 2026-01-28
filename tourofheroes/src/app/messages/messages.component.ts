import { Component } from '@angular/core';
import { MessageService } from '../message.service';
import { NgFor, NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-messages',
  imports: [NgFor, NgIf],
  standalone: true,
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent {
  constructor(public messageService: MessageService) { }
}
