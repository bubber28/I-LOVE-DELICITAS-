export function SiteFooter() {
  return (
    <footer className="border-t border-choco-500/10 bg-cream-100/70">
      <div className="mx-auto grid w-full max-w-6xl gap-4 px-4 py-8 text-sm text-choco-700 sm:grid-cols-3 sm:px-6">
        <div>
          <p className="font-semibold">Deliciosas</p>
          <p className="text-choco-700/75">Confeitaria de bairro com entrega rapida e sabor memoravel.</p>
        </div>
        <div>
          <p className="font-semibold">Horario</p>
          <p className="text-choco-700/75">Seg a Sab: 08h as 20h</p>
        </div>
        <div>
          <p className="font-semibold">Contato</p>
          <p className="text-choco-700/75">WhatsApp: (11) 90000-0000</p>
        </div>
      </div>
    </footer>
  );
}
