import { Music, Ear, Clock } from 'lucide-react';

export function Introduction() {
  return (
    <div className="max-w-4xl">
      <h2 className="mb-6">Welcome to Aural Skill</h2>
      
      <div className="max-w-prose space-y-4 mb-8">
        <p className="text-gray-700">
          Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.
        </p>
        <p className="text-gray-700">
          We will cover three main areas:
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mb-4">
            <Music className="w-6 h-6 text-sky-600" />
          </div>
          <h3 className="mb-2">Intervals</h3>
          <p className="text-gray-600 text-sm">
            The distance between two pitches, fundamental to melody recognition.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <Ear className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="mb-2">Chords</h3>
          <p className="text-gray-600 text-sm">
            The sound of three or more pitches played simultaneously, creating harmony.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
            <Clock className="w-6 h-6 text-amber-600" />
          </div>
          <h3 className="mb-2">Rhythm</h3>
          <p className="text-gray-600 text-sm">
            The pattern of sounds and silences in time, the pulse of music.
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-xl p-6 border border-sky-200">
        <p className="text-gray-700">
          Use the sidebar to navigate through the chapters. Each chapter includes text explanations, 
          in-text examples with playable audio, and a dedicated exercise section to test your knowledge.
        </p>
      </div>
    </div>
  );
}
