import nodemailer from 'nodemailer';

export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }

    async sendTutorSessionNotification(email: string, data: {
        studentName: string;
        group: string;
        schedule: any;
    }): Promise<void> {
        await this.transporter.sendMail({
            to: email,
            subject: 'Nueva Sesión de Asesoría Programada',
            html: `
                <!DOCTYPE html>
                <html>
                <body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa;">
                        <tr>
                            <td align="center" style="padding: 20px;">
                                <table width="600" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                    <!-- Header -->
                                    <tr>
                                        <td style="background-color: #E45E2D; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                                            <h1 style="margin: 0; font-size: 24px;">Nueva Sesión de Asesoría</h1>
                                        </td>
                                    </tr>

                                    <!-- Content -->
                                    <tr>
                                        <td style="padding: 20px;">
                                            <table width="100%" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td style="padding: 10px; background-color: #f8f9fa; border-radius: 4px; margin-bottom: 10px;">
                                                        <strong style="color: #5B3427;">Estudiante:</strong>
                                                        <div style="color: #333; margin-top: 5px;">${data.studentName}</div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 10px; background-color: #f8f9fa; border-radius: 4px; margin-bottom: 10px;">
                                                        <strong style="color: #5B3427;">Grupo:</strong>
                                                        <div style="color: #333; margin-top: 5px;">${data.group}</div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 10px; background-color: #f8f9fa; border-radius: 4px;">
                                                        <strong style="color: #5B3427;">Horario:</strong>
                                                        <div style="color: #333; margin-top: 5px;">${data.schedule.day_of_week}, ${data.schedule.hour}</div>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>

                                    <!-- Footer -->
                                    <tr>
                                        <td style="padding: 20px; text-align: center; color: #666; border-top: 1px solid #eee;">
                                            <p style="margin: 0;">Sistema de Asesorías UPQROO</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
            `
        });
    }
    async sendTutorFeedback(email: string, feedback: string): Promise<void> {
        await this.transporter.sendMail({
            to: email,
            subject: 'Retroalimentación de Tutoría',
            html: `
                <!DOCTYPE html>
                <html>
                <body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa;">
                        <tr>
                            <td align="center" style="padding: 20px;">
                                <table width="600" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                    <tr>
                                        <td style="background-color: #E45E2D; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                                            <h1 style="margin: 0; font-size: 24px;">Retroalimentación de Tutoría</h1>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td style="padding: 20px;">
                                            <h2 style="color: #5B3427; margin-bottom: 10px;">Comentario:</h2>
                                            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
                                                ${feedback}
                                            </div>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td style="padding: 20px; text-align: center; color: #666;">
                                            <p style="margin: 0;">Sistema de Asesorias UPQROO</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
            `
        });
    }
}