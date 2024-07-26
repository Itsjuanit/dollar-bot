import { Telegraf } from "telegraf";
import fetch from "node-fetch";
import dotenv from "dotenv";

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Usar la variable de entorno para el token del bot
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const API_URL = "https://dolarapi.com/v1/dolares";

bot.start((ctx) =>
  ctx.reply(
    "¡Hola!😏 Pregúntame la cotización del dólar en Argentina con el comando /dolar"
  )
);

bot.command("dolar", async (ctx) => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Error al obtener los datos");
    }
    const data = await response.json();

    // Filtrar los diferentes tipos de cotización
    const oficial = data.find((cotizacion) => cotizacion.nombre === "Oficial");
    const blue = data.find((cotizacion) => cotizacion.nombre === "Blue");
    const bolsa = data.find((cotizacion) => cotizacion.nombre === "Bolsa");
    const ccl = data.find(
      (cotizacion) => cotizacion.nombre === "Contado con liquidación"
    );
    const tarjeta = data.find((cotizacion) => cotizacion.nombre === "Tarjeta");

    const message = `
            Cotizaciones del dólar en Argentina (actualizado) ${new Date(
              oficial?.fechaActualizacion
            ).toLocaleString()}:
            - Oficial: Compra: 💵 $${oficial?.compra} | Venta: 💵 $${
      oficial?.venta
    } 
            - Blue: Compra: 💵 $${blue?.compra} | Venta: 💵 $${blue?.venta} 
            - Bolsa: Compra: 💵 $${bolsa?.compra} | Venta: 💵 $${bolsa?.venta} 
            - Contado con liquidación: Compra: 💵 $${
              ccl?.compra
            } | Venta: 💵 $${ccl?.venta} 
            - Tarjeta: Compra: 💵 $${tarjeta?.compra} | Venta: 💵 $${
      tarjeta?.venta
    } 
        `;

    ctx.reply(message);
  } catch (error) {
    console.error("Error:", error);
    if (error.type === "system" && error.code === "ENOTFOUND") {
      ctx.reply(
        "No se pudo resolver la dirección de la API. Verifica tu conexión a Internet y la URL de la API."
      );
    } else {
      ctx.reply(
        "Hubo un error al obtener la cotización del dólar. Por favor, intenta nuevamente más tarde."
      );
    }
  }
});

// Nuevo comando /luisina
bot.command("luisina", (ctx) => {
  const luisinaMessage = `
─────▄█▀█▄──▄███▄────❤
────▐█░██████████▌────
─────██▒█████████─────
──────▀████████▀──────
─────────▀██▀─────────
  `;
  ctx.reply(luisinaMessage);
});

bot.launch();

console.log("Bot de Telegram iniciado...");
