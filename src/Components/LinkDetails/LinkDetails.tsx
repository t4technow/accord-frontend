import React, { useState, useEffect } from "react";
import axios from "axios";
import cheerio from "cheerio";

interface SiteDetails {
	title?: string;
	description?: string;
	image?: string;
}

interface ExternalSiteProps {
	url: string;
}

const ExternalSiteDetails: React.FC<ExternalSiteProps> = ({ url }) => {
	const [siteDetails, setSiteDetails] = useState<SiteDetails | null>(null);

	const fetchExternalSiteDetails = async () => {
		try {
			const response = await axios.get(
				"https://cors-anywhere.herokuapp.com/" + url,
				{ headers: {} }
			);
			const html = response.data;
			console.log(html);
			// const $ = cheerio.load(html);

			// const title = $('meta[property="og:title"]').attr("content");
			// const description = $('meta[property="og:description"]').attr("content");
			// const image = $('meta[property="og:image"]').attr("content");

			// setSiteDetails({ title, description, image });
		} catch (error) {
			console.error("Error fetching external site details:", error);
			setSiteDetails(null);
		}
	};

	useEffect(() => {
		fetchExternalSiteDetails();
	}, [url]);

	return (
		<div className="site-info">
			{siteDetails ? (
				<>
					<h3>{siteDetails.title}</h3>
					<p>{siteDetails.description}</p>
					<img src={siteDetails.image} alt={siteDetails.title} />
				</>
			) : (
				<div>Loading site details...</div>
			)}
		</div>
	);
};

export default ExternalSiteDetails;
