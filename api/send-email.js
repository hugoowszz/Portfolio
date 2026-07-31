import { Resend } from 'resend';

export default async function handler(req, res) {
  // Garante que só aceitamos requisições do tipo POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { email, subject, message } = req.body;

  // Validação básica dos campos
  if (!email || !subject || !message) {
    return res.status(400).json({ error: 'Todos os campos (email, subject, message) são obrigatórios.' });
  }

  // Inicializa o Resend utilizando a chave de API (prioriza a variável de ambiente segura da Vercel)
  const apiKey = process.env.RESEND_API_KEY;
  const resend = new Resend(apiKey);

  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'hugoowvicttor2006@gmail.com',
      subject: `Portfólio: ${subject}`,
      html: `
        <h3>Nova Mensagem Recebida do Portfólio</h3>
        <p><strong>Remetente:</strong> ${email}</p>
        <p><strong>Assunto:</strong> ${subject}</p>
        <p><strong>Mensagem:</strong></p>
        <div style="background-color: #f1f5f9; padding: 15px; border-radius: 6px; color: #1e293b; white-space: pre-wrap;">
          ${message}
        </div>
      `
    });

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Erro ao enviar email pelo Resend:', error);
    return res.status(500).json({ error: 'Ocorreu um erro interno ao enviar o e-mail.' });
  }
}
