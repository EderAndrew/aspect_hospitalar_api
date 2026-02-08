set -e

echo "Atualizando código..."
git pull

echo "Instalando dependencias..."
pnpm install

echo "Build api..."
pnpm build

echo "Reiniciando PM2..."
pm2 restart ecosystem.config.js