import {
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'

let registered = false

export function registerCharts() {
  if (registered) return
  registered = true
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    LineController,
    BarController,
    Filler,
    Title,
    Tooltip,
    Legend,
  )
}
