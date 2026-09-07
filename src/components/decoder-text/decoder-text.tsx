import { useReducedMotion, useSpring } from 'framer-motion';
import { memo, useEffect, useRef } from 'react';
import { VisuallyHidden } from '~/components/visually-hidden';
import { delay } from '~/utils/delay';
import { classes } from '~/utils/style';
import styles from './decoder-text.module.css';

/**
 * The text resolves out of noise. The noise is drawn from mathematical and
 * plotting notation rather than an arbitrary alphabet, so the effect reads as
 * a number settling rather than a glitch.
 */
// prettier-ignore
const glyphs = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  '+', '−', '×', '÷', '=', '≠', '≈', '≤', '≥', '±',
  '∑', '∏', '∫', '√', '∞', '∂', '∇', 'Δ', 'σ', 'µ',
  'λ', 'θ', 'α', 'β', 'π', 'ρ', 'φ', 'ψ', 'ω', 'χ',
  '⟨', '⟩', '⌈', '⌉', '⌊', '⌋', '[', ']', '{', '}',
  '│', '─', '┼', '╱', '╲', '·', '•', '◦', '▔', '▁',
  '%', '#', '^', '~', '<', '>', '/', '\\', '|', '*',
];

const CharType = {
  Glyph: 'glyph',
  Value: 'value',
} as const;

type OutputChar = { type: (typeof CharType)[keyof typeof CharType]; value: string };

function shuffle(content: string[], output: OutputChar[], position: number): OutputChar[] {
  return content.map((value, index) => {
    if (index < position) {
      return { type: CharType.Value, value };
    }

    if (position % 1 < 0.5) {
      const rand = Math.floor(Math.random() * glyphs.length);
      return { type: CharType.Glyph, value: glyphs[rand] };
    }

    return { type: CharType.Glyph, value: output[index]?.value ?? glyphs[0] };
  });
}

type DecoderTextProps = {
  text: string;
  start?: boolean;
  delay?: number;
  className?: string;
  [key: string]: unknown;
};

export const DecoderText = memo(
  ({ text, start = true, delay: startDelay = 0, className, ...rest }: DecoderTextProps) => {
    const output = useRef<OutputChar[]>([{ type: CharType.Glyph, value: '' }]);
    const container = useRef<HTMLSpanElement>(null);
    const reduceMotion = useReducedMotion();
    const decoderSpring = useSpring(0, { stiffness: 8, damping: 5 });

    useEffect(() => {
      const containerInstance = container.current;
      if (!containerInstance) return;

      const content = text.split('');

      const renderOutput = () => {
        containerInstance.innerHTML = output.current
          .map(item => `<span class="${styles[item.type]}">${item.value}</span>`)
          .join('');
      };

      const unsubscribeSpring = decoderSpring.on('change', value => {
        output.current = shuffle(content, output.current, value);
        renderOutput();
      });

      const startSpring = async () => {
        await delay(startDelay);
        decoderSpring.set(content.length);
      };

      if (start && !reduceMotion) {
        startSpring();
      }

      if (reduceMotion) {
        output.current = content.map(value => ({ type: CharType.Value, value }));
        renderOutput();
      }

      return () => unsubscribeSpring?.();
    }, [decoderSpring, reduceMotion, start, startDelay, text]);

    return (
      <span className={classes(styles.text, className)} {...rest}>
        <VisuallyHidden className={styles.label}>{text}</VisuallyHidden>
        <span aria-hidden className={styles.content} ref={container} />
      </span>
    );
  }
);

DecoderText.displayName = 'DecoderText';
