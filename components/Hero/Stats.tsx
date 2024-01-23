import { motion } from "framer-motion";
const stats = [
  { id: 1, name: 'Messages every 24 hours', value: '2,000+' },
  { id: 2, name: 'Visitors', value: '80,000+' },
  { id: 3, name: 'Served countries', value: '170+' },
]

export default function Stats() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <motion.div whileInView={{ y: 0 }} initial={{ y: 50 }}  transition={{ ease: "easeOut", duration: 1 }} className="mx-auto max-w-7xl px-6 lg:px-8">
        <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.id} className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base leading-7 text-gray-600">{stat.name}</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </motion.div>
    </div>
  )
}
