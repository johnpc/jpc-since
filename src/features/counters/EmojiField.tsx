import { useState } from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import './counters.css';

/**
 * Emoji chooser (mirrors jpc-countdown): a button showing the current emoji
 * that toggles a searchable emoji-mart grid. Picking one closes the grid.
 */
export function EmojiField({
  value,
  onSelect,
}: {
  value: string;
  onSelect: (emoji: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="cform__field">
      <span className="cform__label">Emoji</span>
      {open ? (
        <Picker
          data={data}
          theme="dark"
          previewPosition="none"
          onEmojiSelect={(s: { native: string }) => {
            onSelect(s.native);
            setOpen(false);
          }}
        />
      ) : (
        <button
          type="button"
          className="cform__emoji-btn"
          aria-label="Choose emoji"
          onClick={() => setOpen(true)}
        >
          <span className="cform__emoji-glyph" aria-hidden="true">
            {value}
          </span>
          <span className="cform__emoji-hint since-meta">Tap to change</span>
        </button>
      )}
    </div>
  );
}
