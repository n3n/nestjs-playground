import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DocumentService } from './document.service';
import { Actions } from './document.machine';

class DocumentWorkflowDto {
  action: Actions;
}

@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Get()
  public list() {
    return this.documentService.list();
  }

  @Get(':id')
  public async getById(@Param('id') id: number) {
    const document = this.documentService.getById(id);
    const workflow = await this.documentService.createWorkflow(document);

    return {
      data: document,
      workflow: {
        events: workflow.initialState.events,
        currentState: workflow.initialState.value,
        nextEvents: workflow.initialState.nextEvents,
      },
    };
  }

  @Post(':id/workflow')
  public async workflow(@Param('id') id: number, @Body() body: DocumentWorkflowDto) {
    const document = this.documentService.getById(Number(id));

    const workflow = await this.documentService.createWorkflow(document);
    workflow.send({ type: body.action });

    return this.documentService.getById(id);
  }
}
