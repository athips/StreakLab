import { Chart } from 'chart.js'
import { useEffect, useRef } from 'react'
import { registerCharts } from '../../charts/register'

/** Imperative Chart.js — avoids react-chartjs-2 canvas reuse with Strict Mode */
export function SleepCodingChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    registerCharts()
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['<6h', '6-7h', '7-8h', '8h+'],
        datasets: [
          {
            type: 'bar',
            data: [45, 72, 110, 149],
            backgroundColor: ['#ffd5c2', '#ffd5c2', '#9ee0fb', '#1cb0f6'],
            borderRadius: 8,
            borderSkipped: false,
          },
          {
            type: 'line',
            data: [3, 5, 7.5, 9.5],
            tension: 0.4,
            borderColor: '#ff6b35',
            borderWidth: 2.5,
            backgroundColor: 'transparent',
            pointBackgroundColor: '#ff6b35',
            pointRadius: 5,
            yAxisID: 'y1',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { size: 11, weight: 'bold' }, color: '#afafaf' },
          },
          y: {
            grid: { color: 'rgba(0,0,0,0.04)' },
            ticks: { font: { size: 10 }, color: '#afafaf' },
            title: { display: true, text: 'Code lines', font: { size: 10 }, color: '#afafaf' },
          },
          y1: {
            position: 'right',
            grid: { display: false },
            ticks: { font: { size: 10 }, color: '#ff6b35' },
            min: 0,
            max: 10,
            title: { display: true, text: 'Energy /10', font: { size: 10 }, color: '#ff6b35' },
          },
        },
      },
    })

    return () => {
      chart.destroy()
    }
  }, [])

  return <canvas ref={canvasRef} className="h-full w-full max-h-full" />
}

export function EnergyLevelsChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    registerCharts()
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            data: [7, 5, 8.5, 7, null, null, null],
            borderColor: '#ce82ff',
            backgroundColor: 'rgba(206,130,255,0.1)',
            tension: 0.5,
            borderWidth: 2.5,
            pointBackgroundColor: '#ce82ff',
            pointRadius: 5,
            fill: true,
            spanGaps: false,
          },
          {
            data: [8, 4, 9, 6, null, null, null],
            borderColor: '#1cb0f6',
            backgroundColor: 'rgba(28,176,246,0.07)',
            tension: 0.5,
            borderWidth: 2.5,
            pointBackgroundColor: '#1cb0f6',
            pointRadius: 5,
            fill: true,
            spanGaps: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { size: 11, weight: 'bold' }, color: '#afafaf' },
          },
          y: {
            min: 0,
            max: 10,
            grid: { color: 'rgba(0,0,0,0.04)' },
            ticks: { font: { size: 10 }, color: '#afafaf' },
          },
        },
      },
    })

    return () => {
      chart.destroy()
    }
  }, [])

  return <canvas ref={canvasRef} className="h-full w-full max-h-full" />
}
