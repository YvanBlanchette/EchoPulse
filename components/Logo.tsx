import Image from "next/image";

interface LogoProps {
	width: number;
	height: number;
	variant: string;
}

const Logo = ({ width, height, variant }: LogoProps) => {
	return (
		<Image src={variant === "light" ? "/images/EchoPulse_logo.svg" : "/images/EchoPulse_logo-dark.svg"} alt="EchoPulse Logo" width={width} height={height} />
	);
};
export default Logo;
