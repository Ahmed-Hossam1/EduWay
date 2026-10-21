// Small helpers to draw the SVG charts from a list of numbers

// [10, 30, 20] → "0,40 50,0 100,20" (x from left to right, y: the biggest value = top)
export function toPoints(values: number[], width: number, height: number): string {
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1; // all equal → avoid dividing by 0
    const step = values.length > 1 ? width / (values.length - 1) : 0;

    return values
        .map((value, index) => {
            const x = index * step;
            const y = height - ((value - min) / range) * height;
            return `${x.toFixed(1)},${y.toFixed(1)}`;
        })
        .join(" ");
}

// 4820 → "$4,820"
export function formatMoney(value: number): string {
    return value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}
