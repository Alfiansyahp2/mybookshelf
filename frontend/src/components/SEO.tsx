import { Helmet } from "react-helmet-async";

interface SEOProps {
    title: string;
    description?: string;
    type?: string;
    image?: string;
    url?: string;
}

const SEO = ({ 
    title, 
    description = "Manage and explore your personal library with MyBookshelf.", 
    type = "website", 
    image = "/og-image.svg", 
    url 
}: SEOProps) => {
    const siteName = "MyBookshelf";
    const fullTitle = `${title} | ${siteName}`;

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />

            {/* Open Graph tags */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content={type} />
            <meta property="og:site_name" content={siteName} />
            {url && <meta property="og:url" content={url} />}
            {image && <meta property="og:image" content={image} />}

            {/* Twitter tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            {image && <meta name="twitter:image" content={image} />}
        </Helmet>
    );
};

export default SEO;
