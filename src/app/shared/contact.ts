const WHATSAPP_NUMBER = '5531983966089';

export function whatsappUrl(projectTitle?: string): string {
  const message = projectTitle
    ? `Olá! Conheci o projeto ${projectTitle} no site da SS Interiores e gostaria de conversar sobre um projeto para o meu espaço.`
    : 'Olá! Vim pelo site da SS Interiores e gostaria de conversar sobre um projeto de interiores para o meu espaço.';
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
