import { Injectable } from '@nestjs/common';
import { CreateIncomingDocumentDto } from './dto/create-incoming_document.dto';
import { UpdateIncomingDocumentDto } from './dto/update-incoming_document.dto';

@Injectable()
export class IncomingDocumentsService {
  create(
    // createIncomingDocumentDto: CreateIncomingDocumentDto,
    pdfFiles: Array<Express.Multer.File>,
  ) {
    const fileNames = pdfFiles.map(file => file.filename);
    return {
      message: 'Files uploaded successfully',
      filenames: fileNames,
    };
  }

  findAll() {
    return `This action returns all incomingDocuments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} incomingDocument`;
  }

  update(id: number, updateIncomingDocumentDto: UpdateIncomingDocumentDto) {
    return `This action updates a #${id} incomingDocument`;
  }

  remove(id: number) {
    return `This action removes a #${id} incomingDocument`;
  }
}
