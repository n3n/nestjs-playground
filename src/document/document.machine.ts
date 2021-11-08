import { createMachine, send } from 'xstate';

export enum States {
  Draft = 'draft',
  WaitingForApproval = 'waiting_for_approval',
  ChangeRequest = 'change_request',
  Approved = 'approved',
  Rejected = 'rejected',
}

export enum Actions {
  Submit = 'submit',
  ChangeRequest = 'change_request',
  Approve = 'approve',
  Reject = 'reject',
}

export const documentApprovalMachine = (initial: States) =>
  createMachine({
    id: 'Document Approval',
    initial: initial,
    states: {
      [States.Draft]: {
        description: 'แบบร่าง',
        on: {
          [Actions.Submit]: {
            actions: send('submit'),
            // actions: [Actions.Submit],
          },
        },
        invoke: {
          id: 'aa',
          src: () => {
            console.log('hello');
            return new Promise(() => 'asdfgh');
          },
          // autoForward: true,
          onDone: {
            target: States.WaitingForApproval,
          },
          onError: {},
        },
      },
      [States.WaitingForApproval]: {
        description: 'รอการพิจารณา',
        on: {
          [Actions.ChangeRequest]: {
            target: States.ChangeRequest,
            actions: [Actions.ChangeRequest],
          },
          [Actions.Approve]: {
            target: States.Approved,
            actions: [Actions.Approve],
          },
          [Actions.Reject]: {
            target: States.Rejected,
            actions: [Actions.Reject],
          },
        },
      },
      [States.ChangeRequest]: {
        description: 'ตีกลับให้ปรับแก้ข้อมูล',
        on: {
          [Actions.Submit]: {
            target: States.WaitingForApproval,
            actions: [Actions.Submit],
          },
        },
      },
      [States.Approved]: {
        description: 'อนุมัติเอกสาร',
        type: 'final',
      },
      [States.Rejected]: {
        description: 'ไม่อนุมัติเอกสาร',
        type: 'final',
      },
    },
  });
