import { env } from './config/env';

async function globalSetup(): Promise<void> {
  try {
    const response = await fetch(`${env.apiUrl.replace('/api', '')}/api/inventarios`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (!response.ok && response.status !== 401 && response.status !== 403) {
      throw new Error(`Backend respondió con status ${response.status}`);
    }

    console.log('Backend accesible en', env.apiUrl);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(
      `No se pudo conectar al backend en ${env.apiUrl}. ` +
        `Asegúrese de que el backend esté corriendo en el puerto 8050. Detalle: ${message}`
    );
  }
}

export default globalSetup;
