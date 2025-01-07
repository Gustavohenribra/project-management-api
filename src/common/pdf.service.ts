import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { Project } from '../projects/projects.entity';
import { Response } from 'express';

@Injectable()
export class PdfService {
  generateProjectReport(project: Project, res: Response): void {
    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=project_${project.id}_report.pdf`);

    doc.pipe(res);

    // Header
    doc.fontSize(20).text(`Project Report: ${project.name}`, { align: 'center' });
    doc.moveDown();

    // Project Details
    doc.fontSize(12).text(`Description: ${project.description}`);
    doc.text(`Status: ${project.status}`);
    doc.text(`Owner: ${project.owner.name} (${project.owner.email})`);
    doc.moveDown();

    // Members
    doc.fontSize(14).text('Members:', { underline: true });
    project.members.forEach((member, index) => {
      doc.fontSize(12).text(`${index + 1}. ${member.name} (${member.email})`);
    });

    doc.end();
  }
}