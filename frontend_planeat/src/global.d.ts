export {}

declare global {
	namespace JSX {
		type Element = import('react').ReactElement
	}
}