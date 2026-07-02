import { MetadataRoute } from 'next';
import { allServices } from '@/data/services';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://betteriligancity.org';

    const routes = [
        { path: '', freq: 'weekly', prio: 1 },
        { path: '/services', freq: 'daily', prio: 0.9 },
        { path: '/iligan/city-stats', freq: 'weekly', prio: 0.8 },
        { path: '/iligan/electricity', freq: 'monthly', prio: 0.8 },
        { path: '/transparency/budget', freq: 'monthly', prio: 0.8 },
        { path: '/about', freq: 'yearly', prio: 0.7 },
        { path: '/volunteer', freq: 'yearly', prio: 0.7 },
        { path: '/privacy-policy', freq: 'monthly', prio: 0.7 },
        { path: '/terms-of-service', freq: 'monthly', prio: 0.7 },
        { path: '/government/directory', freq: 'yearly', prio: 0.7 },
        { path: '/government/departments', freq: 'yearly', prio: 0.7 },
    ] as const;

    const lastModified = new Date();

    const staticRoutes: MetadataRoute.Sitemap = routes.map((route) => ({
        url: `${baseUrl}${route.path}`,
        lastModified,
        changeFrequency: route.freq as MetadataRoute.Sitemap[number]['changeFrequency'],
        priority: route.prio,
    }));

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
