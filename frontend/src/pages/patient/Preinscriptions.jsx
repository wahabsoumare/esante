export default function PatientPreinscriptions() {
  return (
    <div className="card">
      <div className="h3">Préinscriptions</div>
      <p className="mt-2 text-sm text-zinc-600">Soumettez vos documents avant votre consultation présentielle.</p>
      <form className="mt-4 grid gap-3">
        <input type="text" placeholder="Objet (ex: nouveau patient, suivi…)" className="px-4 py-3 rounded-xl border border-zinc-200 bg-white" />
        <input type="file" className="px-4 py-3 rounded-xl border border-zinc-200 bg-white" />
        <textarea placeholder="Message" className="px-4 py-3 rounded-xl border border-zinc-200 bg-white"></textarea>
        <button className="btn">Envoyer</button>
      </form>
    </div>
  )
}
