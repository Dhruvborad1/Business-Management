import { motion } from 'framer-motion'
import HeroSection from './HeroSection'
import PagePlaceholder from './PagePlaceholder'

function Customers() {
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
                    title="Customers Page"
                    description="View customer details, purchase history, and manage customer relationships."
                />
            </div>
        </motion.div>
    )
}

export default Customers