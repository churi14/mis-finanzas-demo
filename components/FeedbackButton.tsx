import { MessageSquarePlus } from 'lucide-react';

export default function FeedbackButton() {
  return (
    <a 
      href="mailto:hola@enredconsultora.com?subject=Feedback EnQuéGasto"
      className="fixed bottom-6 right-6 z-40 bg-slate-900 text-white p-3 rounded-full shadow-xl hover:scale-110 transition-transform cursor-pointer group flex items-center gap-0 overflow-hidden hover:pr-4 hover:gap-2"
      title="Danos tu opinión"
    >
      <MessageSquarePlus size={24} />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap text-sm font-bold">
        Sugerencias
      </span>
    </a>
  );
}