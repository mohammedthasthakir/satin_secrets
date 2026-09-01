import { useEffect } from 'react'

interface SizeGuideModalProps {
  onClose: () => void
  category?: string
}

const braSizes = [
  { band: '32', cups: ['A', 'B', 'C', 'D'], underbust: '68–72', overbust: { A: '77–80', B: '81–84', C: '85–88', D: '89–92' } },
  { band: '34', cups: ['A', 'B', 'C', 'D'], underbust: '73–77', overbust: { A: '82–85', B: '86–89', C: '90–93', D: '94–97' } },
  { band: '36', cups: ['A', 'B', 'C', 'D'], underbust: '78–82', overbust: { A: '87–90', B: '91–94', C: '95–98', D: '99–102' } },
  { band: '38', cups: ['A', 'B', 'C', 'D'], underbust: '83–87', overbust: { A: '92–95', B: '96–99', C: '100–103', D: '104–107' } },
]

const clothingSizes = [
  { size: 'XS', bust: '76–80', waist: '58–62', hips: '84–88', uk: '6', us: '2', eu: '34' },
  { size: 'S', bust: '81–85', waist: '63–67', hips: '89–93', uk: '8', us: '4', eu: '36' },
  { size: 'M', bust: '86–90', waist: '68–72', hips: '94–98', uk: '10', us: '6', eu: '38' },
  { size: 'L', bust: '91–96', waist: '73–78', hips: '99–104', uk: '12', us: '8', eu: '40' },
  { size: 'XL', bust: '97–102', waist: '79–84', hips: '105–110', uk: '14', us: '10', eu: '42' },
  { size: 'XXL', bust: '103–108', waist: '85–90', hips: '111–116', uk: '16', us: '12', eu: '44' },
]

export default function SizeGuideModal({ onClose, category }: SizeGuideModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const isBra = category === 'Bras'

  return (
    <div
      className="fixed inset-0 z-[160] flex items-center justify-center p-4 modal-backdrop"
      style={{ background: 'rgba(42,24,16,0.6)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="modal-content bg-card rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="font-serif text-2xl font-bold text-foreground">Size Guide</h2>
            <p className="text-sm text-muted-foreground mt-0.5">All measurements in centimetres (cm)</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-secondary transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* How to measure */}
          <div className="bg-secondary rounded-2xl p-4 mb-6">
            <p className="font-semibold text-sm text-foreground mb-3">📐 How to Measure</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-muted-foreground">
              <div>
                <p className="font-semibold text-foreground mb-1">Bust</p>
                <p>Measure around the fullest part of your chest, keeping the tape parallel to the floor.</p>
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">Waist</p>
                <p>Measure around your natural waistline, the narrowest part of your torso.</p>
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">Hips</p>
                <p>Measure around the fullest part of your hips, approximately 20cm below your waist.</p>
              </div>
            </div>
          </div>

          {/* Size Table */}
          {isBra ? (
            <div className="overflow-x-auto">
              <p className="font-semibold text-foreground mb-3">Bra Size Chart</p>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-primary text-primary-foreground">
                    <th className="text-left px-3 py-2 rounded-tl-xl font-semibold text-xs">Band</th>
                    <th className="text-left px-3 py-2 font-semibold text-xs">Underbust (cm)</th>
                    <th className="text-left px-3 py-2 font-semibold text-xs">Cup A (cm)</th>
                    <th className="text-left px-3 py-2 font-semibold text-xs">Cup B (cm)</th>
                    <th className="text-left px-3 py-2 rounded-tr-xl font-semibold text-xs">Cup C (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  {braSizes.map((row, i) => (
                    <tr key={row.band} className={i % 2 === 0 ? 'bg-background' : 'bg-secondary'}>
                      <td className="px-3 py-2.5 font-bold text-primary">{row.band}</td>
                      <td className="px-3 py-2.5 text-muted-foreground">{row.underbust}</td>
                      <td className="px-3 py-2.5 text-muted-foreground">{row.overbust.A}</td>
                      <td className="px-3 py-2.5 text-muted-foreground">{row.overbust.B}</td>
                      <td className="px-3 py-2.5 text-muted-foreground">{row.overbust.C}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <p className="font-semibold text-foreground mb-3">Clothing Size Chart</p>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-primary text-primary-foreground">
                    {['Size', 'Bust (cm)', 'Waist (cm)', 'Hips (cm)', 'UK', 'US', 'EU'].map((h, i) => (
                      <th key={h} className={`text-left px-3 py-2 font-semibold text-xs ${i === 0 ? 'rounded-tl-xl' : ''} ${i === 6 ? 'rounded-tr-xl' : ''}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {clothingSizes.map((row, i) => (
                    <tr key={row.size} className={i % 2 === 0 ? 'bg-background' : 'bg-secondary'}>
                      <td className="px-3 py-2.5 font-bold text-primary">{row.size}</td>
                      <td className="px-3 py-2.5 text-muted-foreground">{row.bust}</td>
                      <td className="px-3 py-2.5 text-muted-foreground">{row.waist}</td>
                      <td className="px-3 py-2.5 text-muted-foreground">{row.hips}</td>
                      <td className="px-3 py-2.5 text-muted-foreground">{row.uk}</td>
                      <td className="px-3 py-2.5 text-muted-foreground">{row.us}</td>
                      <td className="px-3 py-2.5 text-muted-foreground">{row.eu}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Fit Tips */}
          <div className="mt-6 bg-secondary rounded-2xl p-4">
            <p className="font-semibold text-sm text-foreground mb-2">💡 Fit Tips</p>
            <ul className="text-xs text-muted-foreground space-y-1.5">
              <li>• If you are between sizes, we recommend sizing up for comfort</li>
              <li>• Our pieces are designed with 2–4% stretch allowance</li>
              <li>• Still unsure? Our size assistant can help — chat with us!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
