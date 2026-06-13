import { MetadataRoute } from 'next';
import { allServices } from '@/data/services';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://betteriligancity.org';

    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/services`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/iligan/city-stats`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
    ];

    const serviceRoutes: MetadataRoute.Sitemap = allServices
        .filter((service) => service.type === 'standard')
        .map((service) => ({
            url: `${baseUrl}/services/${service.slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        }));

    const communityRoutes: MetadataRoute.Sitemap = allServices
        .filter((service) => service.type === 'internal')
        .map((community) => ({
            url: `${baseUrl}/community/${community.slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        }));

    return [...staticRoutes, ...serviceRoutes, ...communityRoutes];
}
