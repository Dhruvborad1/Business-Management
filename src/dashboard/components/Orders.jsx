import { motion } from 'framer-motion'
import HeroSection from './HeroSection'
import PagePlaceholder from './PagePlaceholder'

function Orders() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Hero Section */}
            <div className="flex flex-col gap-4">
                <HeroSection />

                {/* Main Content */}
                <PagePlaceholder
                    title="Orders Page"
                    description="Manage order list, status updates, and shipment tracking from this page."
                />
            </div>
        </motion.div>
    )
}

export default Orders