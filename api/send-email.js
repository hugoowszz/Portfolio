import { Resend } from 'resend';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, subject, message } = req.body;

  if (!email || !subject || !message) {
    return res.status(400).json({ error: 'Missing required fields: email, subject, and message are required.' });
  }

  // Chave de API carregada com prioridade da variável de ambiente por segurança, ou fallback da chave fornecida.
  const apiKey = process.env.RESEND_API_KEY;
  const resend = new Resend(apiKey);

  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'hugoowvicttor2006@gmail.com',
      subject: `Portfólio: ${subject}`,
      html: `
        <h3>Nova mensagem recebida do seu Portfólio!</h3>
        <p><strong>Remetente (E-mail):</strong> ${email}</p>
        <p><strong>Assunto:</strong> ${subject}</p>
        <p><strong>Mensagem:</strong></p>
        <div style="background-color: #f1f5f9; padding: 15px; border-radius: 6px; color: #1e293b; font-family: sans-serif; white-space: pre-wrap; line-height: 1.5;">${message}</div>
      `
    });

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
