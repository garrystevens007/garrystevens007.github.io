import type { PresetCategory, PresetRequest } from "@/lib/data";

type PresetsSectionProps = {
  presetCategories: PresetCategory[];
  onLoadPreset: (preset: PresetRequest) => void;
};

export function PresetsSection({ presetCategories, onLoadPreset }: PresetsSectionProps) {
  return (
    <div className="mt-6 border-t border-gray-200 pt-4">
      <h3 className="mb-3 font-semibold text-gray-700">Preset Examples</h3>
      <div className="space-y-3">
        {presetCategories.map((category) => (
          <details key={category.name} className="rounded bg-gray-50">
            <summary className="cursor-pointer rounded p-3 font-semibold text-gray-700 hover:bg-gray-100">
              {category.name}
              {category.description && (
                <span className="ml-2 text-xs font-normal text-gray-500">{category.description}</span>
              )}
            </summary>
            <div className="space-y-2 border-t border-gray-200 bg-white p-3">
              {category.presets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => onLoadPreset(preset)}
                  className="w-full rounded bg-gray-50 px-3 py-2 text-left text-sm transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <div className="font-semibold text-gray-700">{preset.label}</div>
                  <div className="text-xs text-gray-500">
                    {preset.method} {preset.path}
                  </div>
                </button>
              ))}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
