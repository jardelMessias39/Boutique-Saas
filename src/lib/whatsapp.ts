/**
 * Monta um link wa.me com mensagem pré-preenchida.
 * Centralizado aqui para manter o formato da mensagem consistente
 * em todo o site (produto, look, contato geral).
 */
export function buildWhatsAppLink(phone: string, message: string) {
  const digitsOnly = phone.replace(/\D/g, "");
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${digitsOnly}?text=${encoded}`;
}

export function reserveProductMessage(productName: string, price: number) {
  const formattedPrice = price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  return `Olá! Tenho interesse em reservar a peça "${productName}" (${formattedPrice}). Ainda está disponível?`;
}

export function reserveLookMessage(lookName: string) {
  return `Olá! Tenho interesse em reservar o look "${lookName}". Poderia me passar mais detalhes?`;
}

export function reserveCartMessage(items: { name: string; price: number }[]) {
  const lines = items.map((i, idx) => {
    const price = i.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    return `${idx + 1}. ${i.name} — ${price}`;
  });
  const total = items.reduce((sum, i) => sum + i.price, 0);
  const formattedTotal = total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return `Olá! Tenho interesse em reservar estas peças:\n\n${lines.join("\n")}\n\nTotal: ${formattedTotal}\n\nAinda estão disponíveis?`;
}

export function generalContactMessage() {
  return "Olá! Gostaria de saber mais sobre as peças da loja.";
}
