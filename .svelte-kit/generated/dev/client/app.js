export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17'),
	() => import('./nodes/18'),
	() => import('./nodes/19'),
	() => import('./nodes/20'),
	() => import('./nodes/21'),
	() => import('./nodes/22'),
	() => import('./nodes/23'),
	() => import('./nodes/24'),
	() => import('./nodes/25')
];

export const server_loads = [0,3,2];

export const dictionary = {
		"/": [~5],
		"/(admin)/admin": [~11,[3]],
		"/(admin)/admin/imports": [~12,[3]],
		"/(admin)/admin/listings": [~13,[3]],
		"/(admin)/admin/moderation": [~14,[3]],
		"/(public)/category/[...slug]": [~18],
		"/(public)/claim/[slug]": [~19],
		"/(account)/dashboard": [~6,[2]],
		"/(account)/dashboard/billing": [~7,[2]],
		"/(account)/dashboard/enquiries": [~8,[2]],
		"/(account)/dashboard/listings": [~9,[2]],
		"/(account)/dashboard/reviews": [~10,[2]],
		"/(auth)/forgot-password": [15,[4]],
		"/(public)/listing/[slug]": [~20],
		"/(public)/location/[...slug]": [~21],
		"/(auth)/login": [~16,[4]],
		"/(public)/pricing": [~22],
		"/(auth)/register": [~17,[4]],
		"/(public)/reviews/new": [~23],
		"/(public)/search": [~24],
		"/(public)/submit": [~25]
	};

export const hooks = {
	handleError: (({ kind, error }) => { if (kind === 'unknown') { console.error(error); } }),
	
	reroute: (() => {}),
	transport: {}
};

export const decoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.decode]));
export const encoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.encode]));

export const hash = false;

export const decode = (type, value) => decoders[type](value);

export const get_error_template = () => import('../shared/error-template.js').then(m => m.default);