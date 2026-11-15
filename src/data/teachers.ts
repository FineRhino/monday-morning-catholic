/** Who counts as what on the Teachers pages. Every Doctor is also a saint and a theologian. */
export interface Kinds { doctor: boolean; saint: boolean; theologian: boolean; }

export const kindsOf = (t: { proclaimed?: number; saint: boolean; theologian: boolean }): Kinds => {
  const doctor = t.proclaimed !== undefined;
  return { doctor, saint: doctor || t.saint, theologian: doctor || t.theologian };
};

/** Badge labels in a fixed order, e.g. ["Doctor", "Saint", "Theologian"]. */
export const kindLabels = (k: Kinds) =>
  [k.doctor && 'Doctor', k.saint && 'Saint', k.theologian && 'Theologian'].filter(Boolean) as string[];

/** Counts for a list, e.g. for an era heading. */
export const countKinds = (list: Kinds[]) => ({
  doctors: list.filter((k) => k.doctor).length,
  saints: list.filter((k) => k.saint).length,
  theologians: list.filter((k) => k.theologian).length,
});

export const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
