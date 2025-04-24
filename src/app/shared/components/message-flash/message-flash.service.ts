import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
import { IMessageFlash } from "./imessage-flash";

@Injectable({
    providedIn: 'root'
})
export class MessageFlashService {

    private data = new BehaviorSubject<IMessageFlash>({ message: '', type: '', show: false });
    data$: Observable<IMessageFlash> = this.data.asObservable();
    delay: number = 5000;

    constructor() { }

    toggleAlert(iMessageFlash: IMessageFlash) {

        if (iMessageFlash.delay) {
            this.delay = iMessageFlash.delay
        } else {
            iMessageFlash.delay = this.delay
        }

        this.data.next(iMessageFlash);

        if (iMessageFlash.show) {
            setTimeout(() => {
                this.mClose()
            }, iMessageFlash.delay);
        }
    }

    mClose() {
        this.data.next({ message: '', type: '', show: false });
    }

    danger(message: string, delay?: number) {
        this.toggleAlert({
            message: message,
            show: true,
            type: 'danger',
            delay: delay
        })
    }

    success(message: string, delay?: number) {
        this.toggleAlert({
            message: message,
            show: true,
            type: 'success',
            delay: delay
        })
    }

    info(message: string, delay?: number) {
        this.toggleAlert({
            message: message,
            show: true,
            type: 'info',
            delay: delay
        })
    }


}