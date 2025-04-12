import { jwtDecode } from "jwt-decode";
import StepSelectComponents from '../components/StepSelectComponents';
import StepSwitchComponents from '../components/StepSwitchComponents';
import StepTextAreaComponents from '../components/StepTextAreaComponents';
import StepJsonComponents from '../components/StepJsonComponents';
import StepFileComponents from '../components/StepFileComponents';
import StepTextComponents from '../components/StepTextComponents';
import {
    Home,
    Fastfood,
    DirectionsCar,
    Build,
    Business,
    Movie,
    Category,
    LocalGroceryStore,
    HealthAndSafety,
    School,
    ShoppingBag,
    Flight,
    FitnessCenter,
    Pets,
    Wifi,
    WaterDrop,
    ElectricBolt,
    Phone,
    Subscriptions,
    ChildCare,
    CleaningServices
} from '@mui/icons-material';


export const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        return false;
    }

    try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
            localStorage.removeItem("token");
        }
        return decodedToken.exp > currentTime
    }
    catch (err) {
        return false;
    }
}

export const getUser = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        return null;
    }
    try {
        const decodedToken = jwtDecode(token);
        return decodedToken;
    }
    catch (err) {
        return null;
    }
}

export const isValidUrl = (url) => {
    try {
        if (Array.isArray(url)) {
            let image = url.filter((item) => item.match(/\.(jpeg|jpg|gif|png)$/) != null);
            if (image.length > 0) {
                new URL(image[0]);
            }
            else {
                if (url.length > 0) {
                    new URL(url[0]);
                }
            }
        }
        else if (checkIsJson(url) && JSON.parse(url).length > 0) {
            let image = JSON.parse(url).filter((item) => item.match(/\.(jpeg|jpg|gif|png)$/) != null);
            new URL(image[0]);
        }
        else {
            new URL(url);
        }
        return true;
    }
    catch (e) {
        return false;
    }
}

export const getImageUrl = (url) => {
    if (Array.isArray(url)) {
        let image = url.filter((item) => item.match(/\.(jpeg|jpg|gif|png)$/) != null);
        if (image.length > 0) {
            return image[0];
        }
        else {
            if (url.length > 0) {
                return url[0];
            }
            else {
                return url;
            }
        }
    }
    else if (checkIsJson(url) && JSON.parse(url).length > 0) {
        let image = JSON.parse(url).filter((item) => item.match(/\.(jpeg|jpg|gif|png)$/) != null);
        return image[0];
    }
    else {
        return url;
    }
}

export const checkIsJson = (str) => {
    try {
        JSON.parse(str);
    }
    catch (e) {
        return false;
    }
    return true;
}

export const getFormTypes = () => {
    return [
        { component: StepSelectComponents, label: "Basic Details", fieldType: 'select' },
        { component: StepSwitchComponents, label: "Checklist", fieldType: 'checkbox' },
        { component: StepTextComponents, label: "General Information", fieldType: 'text' },
        { component: StepTextAreaComponents, label: "Detailed Information", fieldType: 'textarea' },
        { component: StepJsonComponents, label: "Additional Details", fieldType: 'json' },
        { component: StepFileComponents, label: "Documents & Files", fieldType: 'file' },
    ]
}

export const formatText = (key) => {
    return key.charAt(0).toUpperCase() + key.slice(1).replaceAll("_", " ")
}


export const getFormType = () => {
    return ['select', 'text', 'checkbox', 'textarea', 'json', 'file'];
}


export const getFileNameFromUrl = (url) => {
    const parseUrl = new URL(url);
    const pathname = parseUrl.pathname;
    const filename = pathname.substring(pathname.lastIndexOf("/") + 1);
    return filename;
}

export const getFileMimeTypeFromFileName = (filename) => {
    const extension = filename.split(".").pop().toLowerCase();
    const mimeTypes = {
        "txt": "text/plain",
        "html": "text/html",
        "htm": "text/html",
        "css": "text/css",
        "js": "application/javascript",
        "jpg": "image/jpg",
        "png": "image/png",
        "jpeg": "image/jpeg",
        "mp3": "audio/mpeg",
    }

    if (extension in mimeTypes) {
        return mimeTypes[extension];
    }
    else {
        return "other/other";
    }

}

export const calculateTimeRemaining = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Expired';
    if (diffDays < 30) return `${diffDays} days left`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months left`;
    return `${Math.floor(diffDays / 365)} years left`;
}

export const getCategoryListIcon = (category, color) => {
    const iconProps = {
        sx: { color: color || undefined },
        //   fontSize: "small"
    };

    switch (category?.toLowerCase()) {
        case 'housing':
            return <Home {...iconProps} color={color ? undefined : "primary"} />;
        case 'food':
            return <Fastfood {...iconProps} color={color ? undefined : "secondary"} />;
        case 'transportation':
            return <DirectionsCar {...iconProps} color={color ? undefined : "success"} />;
        case 'utilities':
            return <Build {...iconProps} color={color ? undefined : "warning"} />;
        case 'business':
            return <Business {...iconProps} color={color ? undefined : "info"} />;
        case 'entertainment':
            return <Movie {...iconProps} sx={{ color: color || '#8b5cf6' }} />;
        case 'groceries':
            return <LocalGroceryStore {...iconProps} sx={{ color: color || '#ec4899' }} />;
        case 'healthcare':
            return <HealthAndSafety {...iconProps} color={color ? undefined : "error"} />;
        case 'education':
            return <School {...iconProps} sx={{ color: color || '#14b8a6' }} />;
        case 'shopping':
            return <ShoppingBag {...iconProps} sx={{ color: color || '#f97316' }} />;
        case 'travel':
            return <Flight {...iconProps} sx={{ color: color || '#a855f7' }} />;
        case 'fitness':
            return <FitnessCenter {...iconProps} sx={{ color: color || '#22d3ee' }} />;
        case 'pets':
            return <Pets {...iconProps} sx={{ color: color || '#65a30d' }} />;
        case 'internet':
            return <Wifi {...iconProps} sx={{ color: color || '#0ea5e9' }} />;
        case 'water':
            return <WaterDrop {...iconProps} sx={{ color: color || '#3b82f6' }} />;
        case 'electricity':
            return <ElectricBolt {...iconProps} sx={{ color: color || '#f59e0b' }} />;
        case 'phone':
            return <Phone {...iconProps} sx={{ color: color || '#84cc16' }} />;
        case 'subscriptions':
            return <Subscriptions {...iconProps} sx={{ color: color || '#d946ef' }} />;
        case 'childcare':
            return <ChildCare {...iconProps} sx={{ color: color || '#e11d48' }} />;
        case 'cleaning':
            return <CleaningServices {...iconProps} sx={{ color: color || '#06b6d4' }} />;
        default:
            return <Category {...iconProps} color={color ? undefined : "action"} />;
    }
};

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
    }).replace(',', '');
};