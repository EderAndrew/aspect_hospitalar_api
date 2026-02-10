import ngrok from '@ngrok/ngrok';

async function bootstrap() {
  const listener = await ngrok.forward({
    addr: Number(process.env.NGROK_PORT || 4001),
    authtoken: process.env.NGROK_AUTHTOKEN,
    domain: process.env.NGROK_RESERVED_DOMAIN,
  });

  console.log('🚀 Ngrok ativo em:', listener.url());
}

bootstrap();

// mantém processo vivo
process.stdin.resume();
