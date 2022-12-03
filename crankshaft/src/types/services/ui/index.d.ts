import { SMM } from '../../smm';
import { Service } from '../service';
import { confirm, createConfirmModal } from './confirm-modal';
import { createProgressModal } from './progress-modal';
export declare class UI extends Service {
    confirm: typeof confirm;
    createConfirmModal: typeof createConfirmModal;
    createProgressModal: typeof createProgressModal;
    constructor(smm: SMM);
}
