import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

type PaymentMethod = "dana" | "gopay" | "bank" | null;

const paymentData = {
  dana: {
    name: "DANA",
    number: "085169123955",
    holder: "HABIBIN HARAHAP",
    label: "E-Wallet",
    color: "blue",
    icon: "fa-wallet",
    gradient: "linear-gradient(135deg, #0080ff, #0055cc)",
  },
  gopay: {
    name: "GOPAY",
    number: "085169123955",
    holder: "HABIBIH HARAHAP",
    label: "E-Wallet",
    color: "green",
    icon: "fa-bolt",
    gradient: "linear-gradient(135deg, #00aa13, #008811)",
  },
  bank: {
    name: "BANK JAGO",
    number: "100963947764",
    holder: "HABIBIH HARAHAP",
    label: "Transfer Bank",
    color: "orange",
    icon: "fa-university",
    gradient: "linear-gradient(135deg, #ff6b00, #e55a00)",
  },
};

function formatRupiah(value: string) {
  const num = value.replace(/\D/g, "");
  if (!num) return "";
  return parseInt(num).toLocaleString("id-ID");
}

const steps = [
  { icon: "fa-hand-pointer", text: "Pilih metode pembayaran yang diinginkan" },
  { icon: "fa-copy", text: 'Klik "Salin" untuk menyalin nomor/rekening' },
  { icon: "fa-mobile-alt", text: "Buka aplikasi pembayaran di ponsel Anda" },
  { icon: "fa-paste", text: "Tempel nomor atau scan QRIS" },
  { icon: "fa-paper-plane", text: "Lakukan transfer sesuai jumlah pembayaran" },
  { icon: "fa-whatsapp fab", text: "Kirim bukti transfer via WhatsApp kami" },
];

export default function PaymentGateway() {
  const [activeMethod, setActiveMethod] = useState<PaymentMethod>(null);
  const [nominal, setNominal] = useState("");
  const [imgError, setImgError] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const selected = activeMethod ? paymentData[activeMethod] : null;
  const canPay = !!activeMethod && nominal.replace(/\D/g, "") !== "" && parseInt(nominal.replace(/\D/g, "")) > 0;

  const handleNominalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    setNominal(raw ? formatRupiah(raw) : "");
  };

  const handleCopyInline = (number: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(number).then(() => {
      toast({ title: "Berhasil disalin!", description: `Nomor ${number} disalin ke clipboard.`, duration: 2000 });
    });
  };

  const handleCopySummary = () => {
    if (!selected) return;
    navigator.clipboard.writeText(selected.number).then(() => {
      setCopied(true);
      toast({ title: "Berhasil disalin!", description: `Nomor ${selected.number} disalin ke clipboard.`, duration: 2000 });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const waText = encodeURIComponent(
    `Halo Habibi Store, saya telah melakukan pembayaran.\n\nDetail Pembayaran:\n- Nominal: Rp ${nominal}\n- Metode: ${selected?.name ?? ""}\n- No. Rekening: ${selected?.number ?? ""}\n\nBerikut bukti transfernya:`
  );

  return (
    <>
      <div
        className="min-h-screen flex items-center justify-center p-5"
        style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
      >
        <div className="w-full max-w-[480px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in">

          {/* Header */}
          <div
            className="relative overflow-hidden px-6 py-8 text-center text-white"
            style={{ background: "linear-gradient(to right, #4361ee, #3a0ca3)" }}
          >
            <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)", transform: "rotate(30deg)" }} />
            <div className="flex items-center justify-center gap-2.5 text-2xl font-bold mb-2">
              <i className="fas fa-store text-3xl" />
              HABIBI STORE
            </div>
            <h1 className="text-2xl font-bold tracking-wide mb-1">PAYMENT GATEWAY</h1>
            <p className="text-sm opacity-90 font-light">Lakukan pembayaran dengan metode yang tersedia</p>
            <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
              <span className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm">
                <i className="fas fa-shield-alt text-green-300" /> Aman & Terpercaya
              </span>
              <span className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm">
                <i className="fas fa-clock text-yellow-300" /> Layanan 24/7
              </span>
              <span className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm">
                <i className="fas fa-check-circle text-blue-300" /> Verified Merchant
              </span>
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-center gap-2 px-6 py-3 bg-green-50 border-b border-green-100">
            <i className="fas fa-lock text-green-600 text-sm" />
            <p className="text-xs text-green-700 font-medium">
              Transaksi Anda dilindungi dan aman. Jangan bagikan data pembayaran kepada siapapun.
            </p>
          </div>

          {/* Content */}
          <div className="px-6 py-6">

            {/* Summary Card */}
            {showSummary && selected ? (
              <div className="mb-6 rounded-xl overflow-hidden border-2 border-blue-200 shadow-lg">
                <div className="px-5 py-4 text-white font-bold flex items-center gap-2"
                  style={{ background: "linear-gradient(to right, #4361ee, #3a0ca3)" }}>
                  <i className="fas fa-receipt" />
                  Ringkasan Pembayaran
                </div>
                <div className="p-5 bg-white">
                  <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Total Pembayaran</span>
                    <span className="text-xl font-bold text-blue-600">Rp {nominal}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Metode</span>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs"
                        style={{ background: selected.gradient }}>
                        <i className={`fas ${selected.icon}`} />
                      </div>
                      <span className="text-sm font-semibold text-gray-800">{selected.name}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Nomor Tujuan</span>
                    <span className="text-sm font-bold text-gray-800">{selected.number}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-500">Atas Nama</span>
                    <span className="text-sm font-semibold text-gray-800">{selected.holder}</span>
                  </div>

                  <button
                    onClick={handleCopySummary}
                    className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 mb-3 ${
                      copied ? "bg-green-500 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    <i className={`fas ${copied ? "fa-check" : "fa-copy"}`} />
                    {copied ? "Nomor Berhasil Disalin!" : `Salin Nomor ${selected.name}`}
                  </button>

                  <a
                    href={`https://wa.me/628131919213?text=${waText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 no-underline"
                    style={{ background: "linear-gradient(135deg, #25D366, #128C7E)" }}
                  >
                    <i className="fab fa-whatsapp text-lg" />
                    Kirim Bukti Transfer via WhatsApp
                  </a>

                  <button
                    onClick={() => setShowSummary(false)}
                    className="w-full mt-3 py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ← Kembali ubah metode
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Nominal Input */}
                <div className="mb-5 p-4 rounded-xl border-2 border-blue-100 bg-blue-50">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <i className="fas fa-tag text-blue-600 mr-2" />
                    Nominal Pembayaran
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm">Rp</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="0"
                      value={nominal}
                      onChange={handleNominalChange}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:outline-none text-gray-800 font-semibold text-base bg-white"
                    />
                  </div>
                  <p className="text-xs text-blue-500 mt-1.5">
                    <i className="fas fa-info-circle mr-1" />
                    Isi sesuai nominal yang harus dibayar
                  </p>
                </div>

                {/* Section Title */}
                <div className="flex items-center gap-2.5 text-lg font-semibold mb-4 text-gray-800">
                  <i className="fas fa-credit-card text-blue-600" />
                  <span>Pilih Metode Pembayaran</span>
                </div>

                {/* Payment Options */}
                <div className="flex flex-col gap-3 mb-5">
                  {(Object.entries(paymentData) as [PaymentMethod, typeof paymentData.dana][]).map(([key, p]) => (
                    <div
                      key={key}
                      onClick={() => setActiveMethod(key)}
                      className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                        activeMethod === key
                          ? "border-blue-600 bg-blue-50 shadow-md"
                          : "border-gray-100 hover:border-blue-300 hover:-translate-y-0.5 hover:shadow-md"
                      }`}
                    >
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4 flex-shrink-0 text-white text-xl shadow-md"
                        style={{ background: p.gradient }}>
                        <i className={`fas ${p.icon}`} />
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="text-base font-bold text-gray-800">{p.name}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            p.color === "blue" ? "bg-blue-100 text-blue-600" :
                            p.color === "green" ? "bg-green-100 text-green-600" :
                            "bg-orange-100 text-orange-600"
                          }`}>{p.label}</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-700">{p.number}</p>
                        <p className="text-xs text-gray-500">a/n {p.holder}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {activeMethod === key && (
                          <i className="fas fa-check-circle text-blue-600 text-lg" />
                        )}
                        <button
                          onClick={(e) => handleCopyInline(p.number, e)}
                          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-blue-600 hover:bg-blue-800 transition-all duration-200"
                        >
                          <i className="fas fa-copy text-xs" /> Salin
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tombol Bayar */}
                <button
                  onClick={() => setShowSummary(true)}
                  disabled={!canPay}
                  className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 shadow-md ${
                    canPay
                      ? "text-white hover:-translate-y-1 hover:shadow-xl"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                  style={canPay ? { background: "linear-gradient(to right, #4361ee, #3a0ca3)" } : {}}
                >
                  <i className="fas fa-lock text-sm" />
                  {!nominal && !activeMethod
                    ? "Isi Nominal & Pilih Metode"
                    : !nominal
                    ? "Isi Nominal Terlebih Dahulu"
                    : !activeMethod
                    ? "Pilih Metode Pembayaran"
                    : `Bayar Rp ${nominal}`}
                </button>
                {!canPay && (
                  <p className="text-center text-xs text-gray-400 mt-2">
                    Isi nominal dan pilih metode untuk melanjutkan
                  </p>
                )}

                {/* Divider */}
                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">atau bayar dengan</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* QRIS Section */}
                <div className="text-center px-5 py-6 rounded-xl border border-gray-200"
                  style={{ background: "linear-gradient(to bottom right, #f8f9fa, #e9ecef)" }}>
                  <h3 className="text-lg font-bold text-gray-800 flex items-center justify-center gap-2.5 mb-1">
                    <i className="fas fa-qrcode text-blue-600" />
                    QRIS Payment
                  </h3>
                  <p className="text-xs text-gray-500 mb-4">Berlaku untuk semua aplikasi dompet digital</p>
                  <div className="w-[210px] h-[210px] mx-auto mb-4 rounded-xl overflow-hidden shadow-lg bg-white border border-gray-200 flex items-center justify-center p-2.5">
                    {!imgError ? (
                      <img src="https://iili.io/K4JQw3Q.md.jpg" alt="QRIS Habibi Store"
                        className="w-full h-full object-contain" onError={() => setImgError(true)} />
                    ) : (
                      <div className="text-center text-gray-500 p-5">
                        <i className="fas fa-exclamation-triangle text-4xl text-yellow-400 mb-2 block" />
                        QRIS tidak dapat dimuat<br />Gunakan metode lain
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                    {["DANA", "GoPay", "OVO", "ShopeePay"].map((app) => (
                      <span key={app} className="flex items-center gap-1">
                        <i className="fas fa-check text-green-500" />{app}
                      </span>
                    ))}
                  </div>
                </div>

                {/* WhatsApp standalone */}
                <a
                  href={`https://wa.me/628131919213?text=${encodeURIComponent("Halo Habibi Store, saya telah melakukan pembayaran. Berikut bukti transfernya:")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full mt-5 px-4 py-4 rounded-xl text-white font-semibold transition-all duration-300 no-underline animate-pulse-slow hover:-translate-y-1 hover:shadow-lg"
                  style={{ background: "linear-gradient(135deg, #25D366, #128C7E)", boxShadow: "0 4px 15px rgba(37, 211, 102, 0.3)" }}
                >
                  <i className="fab fa-whatsapp mr-2.5 text-2xl" />
                  Kirim Bukti Transfer via WhatsApp
                </a>
                <p className="text-center text-xs text-gray-400 mt-2">
                  <i className="fas fa-clock mr-1" />
                  Konfirmasi diproses dalam 1×24 jam
                </p>

                {/* Instructions */}
                <div className="mt-6">
                  <h3 className="text-base font-bold text-gray-800 flex items-center gap-2 mb-4">
                    <i className="fas fa-list-ol text-blue-600" />
                    Cara Pembayaran
                  </h3>
                  <div className="flex flex-col gap-3">
                    {steps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold shadow-sm"
                          style={{ background: "linear-gradient(135deg, #4361ee, #3a0ca3)" }}>
                          {idx + 1}
                        </div>
                        <div className="flex items-center gap-2 flex-1 py-1">
                          <i className={`fas ${step.icon} text-blue-400 text-sm w-4`} />
                          <p className="text-sm text-gray-600">{step.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Important Notice */}
                <div className="mt-6 p-4 rounded-xl bg-yellow-50 border border-yellow-200">
                  <div className="flex items-start gap-2">
                    <i className="fas fa-exclamation-triangle text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-yellow-800 mb-1">Penting!</p>
                      <p className="text-xs text-yellow-700 leading-relaxed">
                        Pastikan nominal transfer sesuai dengan tagihan. Simpan bukti pembayaran Anda sebelum menghubungi kami.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-5 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center justify-center gap-6 mb-3">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <i className="fas fa-shield-alt text-green-500" /><span>Aman</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <i className="fas fa-lock text-blue-500" /><span>Terenkripsi</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <i className="fas fa-star text-yellow-400" /><span>Terpercaya</span>
              </div>
            </div>
            <p className="text-center text-gray-400 text-xs">&copy; 2026 Habibi Store. All rights reserved.</p>
            <p className="text-center text-gray-400 text-xs mt-1">
              Butuh bantuan?{" "}
              <a href="https://wa.me/628131919213" target="_blank" rel="noopener noreferrer"
                className="text-green-600 font-medium hover:underline">
                Hubungi CS kami
              </a>
            </p>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
}
