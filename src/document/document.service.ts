import { Injectable } from '@nestjs/common';
import { interpret } from 'xstate';
import { Document } from './document.entity';
import { States, documentApprovalMachine as createDocumentApprovalMachine, Actions } from './document.machine';

@Injectable()
export class DocumentService {
  private documents: Document[] = [
    new Document(1, 'A', States.WaitingForApproval),
    new Document(2, 'B', States.Approved),
    new Document(3, 'C', States.ChangeRequest),
    new Document(4, 'D', States.Rejected),
    new Document(5, 'D', States.Draft),
    new Document(6, 'D', States.Draft),
  ];

  public getById(id: number): Document | undefined {
    return this.documents.find((item) => Number(item.id) === Number(id));
  }

  public list(): Document[] {
    return this.documents;
  }

  public update(document: Document) {
    this.documents = this.documents.map((item) => (Number(item.id) === Number(document.id) ? document : item));
    return document;
  }

  public approve(document: Document) {
    document.stateId = States.Approved;
    return this.update(document);
  }

  public reject(document: Document) {
    document.stateId = States.Rejected;
    return this.update(document);
  }

  public changeRequest(document: Document) {
    document.stateId = States.ChangeRequest;
    return this.update(document);
  }

  public submit(document: Document) {
    document.stateId = States.WaitingForApproval;
    return this.update(document);
  }

  public async createWorkflow(document: Document) {
    const mockFetchUser = async (userId) => {
      console.log('helloworld');
      // Mock however you want, but ensure that the same
      // behavior and response format is used
      return { name: 'Test', location: 'Anywhere' };
    };

    const machine = createDocumentApprovalMachine(document.stateId)
      .withContext({ data: document })
      .withConfig({
        // services: {
        //   services: {
        //     submit: (context, event) => mockFetchUser(context.id),
        //   } as any,
        // },
        actions: {
          [Actions.Approve]: () => {
            console.log(Actions.Approve);
            // this.approve(document);
          },
          [Actions.ChangeRequest]: () => {
            console.log(Actions.ChangeRequest);
            // this.changeRequest(document);
          },
          [Actions.Reject]: () => {
            console.log(Actions.Reject);
            // this.reject(document);
          },
          [Actions.Submit]: () => {
            console.log(Actions.Submit);
            // this.submit(document);
          },
        },
        // services: {
        // submit: (context, event, { src }) => {
        //   console.log(src);
        // },
        // },
      });

    const service = interpret(machine);
    return service.start();
  }
}
