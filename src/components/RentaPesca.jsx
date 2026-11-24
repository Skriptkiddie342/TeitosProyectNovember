import { useRef } from "react";
import styles from "./RentaPesca.module.css";

const LARGO = 150;
const EUROS_POR_VUELTA = 200;

function RentaPesca({ valor, onCambio, min, max }) {
  const anguloAnterior = useRef(null);
  const exacto = useRef(valor);

  const largo = ((valor - min) / (max - min)) * LARGO;
  const giro = ((valor - min) / EUROS_POR_VUELTA) * 360;

  function limitar(numero) {
    return Math.min(max, Math.max(min, numero));
  }

  function angulo(e) {
    const caja = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - (caja.left + caja.width / 2);
    const y = e.clientY - (caja.top + caja.height / 2);
    return (Math.atan2(y, x) * 180) / Math.PI;
  }

  function empezar(e) {
    e.currentTarget.setPointerCapture(e.pointerId);
    anguloAnterior.current = angulo(e);
    exacto.current = valor;
  }

  function girar(e) {
    if (anguloAnterior.current === null) return;

    const actual = angulo(e);
    let diferencia = actual - anguloAnterior.current;
    if (diferencia > 180) diferencia -= 360;
    if (diferencia < -180) diferencia += 360;
    anguloAnterior.current = actual;

    exacto.current = limitar(
      exacto.current + (diferencia / 360) * EUROS_POR_VUELTA,
    );
    const nuevo = Math.round(exacto.current / 10) * 10;
    if (nuevo !== valor) onCambio(nuevo);
  }

  function terminar() {
    anguloAnterior.current = null;
  }

  function teclado(e) {
    const teclas = {
      ArrowRight: valor + 10,
      ArrowUp: valor + 10,
      ArrowLeft: valor - 10,
      ArrowDown: valor - 10,
      PageUp: valor + 100,
      PageDown: valor - 100,
      Home: min,
      End: max,
    };
    if (!(e.key in teclas)) return;

    e.preventDefault();
    onCambio(limitar(teclas[e.key]));
  }

  return (
    <div className={styles.pesca}>
      <p id="renta-etiqueta" className={styles.etiqueta}>
        Renta máxima
      </p>

      <div
        className={styles.escena}
        style={{ "--largo": `${largo}px`, "--giro": `${giro}deg` }}
      >
        <svg className={styles.cana} viewBox="0 0 200 70" aria-hidden="true">
          <line className={styles.mango} x1="8" y1="60" x2="44" y2="48.6" />
          <line
            className={styles.tramoGrueso}
            x1="44"
            y1="48.6"
            x2="110"
            y2="27.8"
          />
          <line
            className={styles.tramoFino}
            x1="110"
            y1="27.8"
            x2="160"
            y2="12"
          />
          <line className={styles.pie} x1="50" y1="47" x2="50" y2="56" />
          <circle className={styles.anilla} cx="80" cy="41" r="3" />
          <circle className={styles.anilla} cx="115" cy="30" r="3" />
          <circle className={styles.anilla} cx="140" cy="22" r="2.5" />
          <circle className={styles.anilla} cx="160" cy="14" r="2" />
          <polyline
            className={styles.hilo}
            points="52,54 80,41 115,30 140,22 160,14"
          />
        </svg>

        <div
          className={styles.carrete}
          role="slider"
          tabIndex={0}
          aria-labelledby="renta-etiqueta"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={valor}
          aria-valuetext={`${valor} euros`}
          onPointerDown={empezar}
          onPointerMove={girar}
          onPointerUp={terminar}
          onPointerCancel={terminar}
          onKeyDown={teclado}
        >
          <div className={styles.manivela}></div>
        </div>

        <div className={styles.sedal}></div>
        <p className={styles.cebo}>{valor} €</p>
        <div className={styles.agua}></div>
      </div>
    </div>
  );
}

export default RentaPesca;
