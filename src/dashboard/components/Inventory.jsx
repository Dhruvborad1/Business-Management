import { motion } from 'framer-motion'
import HeroSection from './HeroSection'
import PagePlaceholder from './PagePlaceholder'

function Inventory() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex flex-col gap-4">
                {/* Hero Section */}
                <HeroSection />

                {/* Main Content */}
                <PagePlaceholder
                    title="Inventory Page"
                    description="View stock levels, manage products, and track inventory movements."
                />
            </div>
        </motion.div>
    )
}

export default Inventory