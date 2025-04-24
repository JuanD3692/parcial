import { Component, OnInit } from '@angular/core';
import { MessageFlashService } from "./message-flash.service";
import { IMessageFlash } from "./imessage-flash";
import { NgClass, NgIf } from "@angular/common";

@Component({
    selector: 'app-message-flash',
    standalone: true,
    imports: [
        NgIf,
        NgClass
    ],
    templateUrl: './message-flash.component.html',
    styleUrl: './message-flash.component.scss'
})
export class MessageFlashComponent implements OnInit {

    iMessageFlash: IMessageFlash = {
        message: "",
        show: false,
        type: "danger"
    }

    constructor(private messageFlashService: MessageFlashService) {

    }

    ngOnInit(): void {
        this.messageFlashService.data$.subscribe((data) => {
            this.iMessageFlash = data;
        });
    }

    close() {
        this.messageFlashService.mClose();
    }


}