import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { LogOut, User2, Moon, Sun } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'
import { useTheme } from '@/providers/theme-provider'

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    return (
        <div className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16 px-4'>
                <div>
                    <Link to="/" className='text-2xl font-bold hover:opacity-80 transition-opacity'>
                        Career<span className='text-[#F83002]'>Lynk</span>
                    </Link>
                </div>
                <div className='flex items-center gap-6'>
                    <ul className='flex font-medium items-center gap-5'>
                        {
                            user && user.role === 'recruiter' ? (
                                <>
                                    <li><Link to="/admin" className="hover:text-primary transition-colors">Dashboard</Link></li>
                                    <li><Link to="/admin/companies" className="hover:text-primary transition-colors">Companies</Link></li>
                                    <li><Link to="/admin/jobs" className="hover:text-primary transition-colors">Jobs</Link></li>
                                </>
                            ) : (
                                <>
                                    <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
                                    <li><Link to="/jobs" className="hover:text-primary transition-colors">Jobs</Link></li>
                                    <li><Link to="/browse" className="hover:text-primary transition-colors">Browse</Link></li>
                                </>
                            )
                        }
                    </ul>

                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                        >
                            {theme === "light" ? (
                                <Moon className="h-5 w-5" />
                            ) : (
                                <Sun className="h-5 w-5" />
                            )}
                            <span className="sr-only">Toggle theme</span>
                        </Button>

                        {
                            user ? (
                                <Popover>
                                    <PopoverTrigger>
                                        <Avatar>
                                            <AvatarImage 
                                                src={user?.profile?.profilePhoto ? `${import.meta.env.VITE_API_URL}${user.profile.profilePhoto}` : "https://github.com/shadcn.png"} 
                                                alt={user?.fullname} 
                                            />
                                            <AvatarFallback>
                                                {user?.fullname?.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-52">
                                        <div onClick={() => navigate("/profile")} className='flex items-center gap-2 w-fit cursor-pointer'>
                                            <User2 className='w-4' />
                                            <span>Profile</span>
                                        </div>
                                        <div onClick={logoutHandler} className='flex items-center gap-2 w-fit cursor-pointer mt-2'>
                                            <LogOut className='w-4' />
                                            <span>Logout</span>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            ) : (
                                <div className='flex items-center gap-2'>
                                    <Button variant="ghost" onClick={() => navigate("/login")}>Login</Button>
                                    <Button onClick={() => navigate("/signup")}>Sign Up</Button>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar