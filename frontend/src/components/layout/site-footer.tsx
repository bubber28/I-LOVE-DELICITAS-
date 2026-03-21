export function SiteFooter() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row px-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} I Love Delicitas. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
