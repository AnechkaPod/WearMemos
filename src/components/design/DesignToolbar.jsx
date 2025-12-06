import React from 'react';
import { 
  Grid3X3, 
  RotateCw, 
  Move, 
  Maximize2,
  Palette,
  Layers
} from 'lucide-react';

const layouts = [
  { id: 'grid', label: 'Grid' },
  { id: 'diagonal', label: 'Diagonal' },
  { id: 'brick', label: 'Brick' },
  { id: 'scatter', label: 'Scatter' }
];

const spacings = [
  { id: 'tight', label: 'Tight' },
  { id: 'normal', label: 'Normal' },
  { id: 'loose', label: 'Loose' }
];

export default function DesignToolbar({ activeTab, settings, onSettingsChange }) {
  if (activeTab === 'mockup') return null;

  return (
    <div className="w-72 bg-white border-l border-gray-100 overflow-y-auto flex-shrink-0">
      <div className="p-6">
        <h3 className="font-semibold text-navy-900 mb-6">Pattern Settings</h3>

        {/* Layout */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Grid3X3 className="w-4 h-4" />
            Layout
          </label>
          <div className="grid grid-cols-2 gap-2">
            {layouts.map((layout) => (
              <button
                key={layout.id}
                onClick={() => onSettingsChange({ ...settings, layout: layout.id })}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  settings.layout === layout.id
                    ? 'bg-navy-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {layout.label}
              </button>
            ))}
          </div>
        </div>

        {/* Rotation */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <RotateCw className="w-4 h-4" />
            Rotation: {settings.rotation || 0}°
          </label>
          <input
            type="range"
            min="0"
            max="360"
            value={settings.rotation || 0}
            onChange={(e) => onSettingsChange({ ...settings, rotation: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0°</span>
            <span>180°</span>
            <span>360°</span>
          </div>
        </div>

        {/* Spacing */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Move className="w-4 h-4" />
            Spacing
          </label>
          <div className="flex gap-2">
            {spacings.map((spacing) => (
              <button
                key={spacing.id}
                onClick={() => onSettingsChange({ ...settings, spacing: spacing.id })}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  settings.spacing === spacing.id
                    ? 'bg-navy-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {spacing.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scale */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Maximize2 className="w-4 h-4" />
            Scale: {settings.scale || 100}%
          </label>
          <input
            type="range"
            min="50"
            max="200"
            value={settings.scale || 100}
            onChange={(e) => onSettingsChange({ ...settings, scale: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>50%</span>
            <span>100%</span>
            <span>200%</span>
          </div>
        </div>

        {/* Background Color */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Palette className="w-4 h-4" />
            Background
          </label>
          <div className="flex gap-2">
            {['#FFFFFF', '#F5F5F5', '#1a1a2e', '#faf8f5'].map((color) => (
              <button
                key={color}
                onClick={() => onSettingsChange({ ...settings, backgroundColor: color })}
                className={`w-10 h-10 rounded-lg border-2 transition-all ${
                  settings.backgroundColor === color
                    ? 'border-rose-500 scale-110'
                    : 'border-gray-200'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Mirror/Flip */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Layers className="w-4 h-4" />
            Effects
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={settings.mirrorH || false}
                onChange={(e) => onSettingsChange({ ...settings, mirrorH: e.target.checked })}
                className="w-4 h-4 rounded text-rose-500 focus:ring-rose-500"
              />
              <span className="text-sm text-gray-700">Mirror Horizontal</span>
            </label>
            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={settings.mirrorV || false}
                onChange={(e) => onSettingsChange({ ...settings, mirrorV: e.target.checked })}
                className="w-4 h-4 rounded text-rose-500 focus:ring-rose-500"
              />
              <span className="text-sm text-gray-700">Mirror Vertical</span>
            </label>
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={() => onSettingsChange({
            layout: 'grid',
            rotation: 0,
            spacing: 'normal',
            scale: 100,
            backgroundColor: '#FFFFFF',
            mirrorH: false,
            mirrorV: false
          })}
          className="w-full py-3 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}