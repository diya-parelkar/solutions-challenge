import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '../components/ThemeProvider';
// import LoginModal from "../pages/login";

interface GenerateDialogProps {
  prompt: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function GenerateDialog({ prompt, open, onOpenChange }: GenerateDialogProps) {
  const navigate = useNavigate();
  const { getCombinedClasses } = useThemeContext();
  const [level, setLevel] = React.useState("");
  const [contentType, setContentType] = React.useState("");

  const handleGenerate = () => {

    navigate({
      pathname: '/generated-website',
      search: `?prompt=${encodeURIComponent(prompt)}&level=${encodeURIComponent(level)}&contentType=${encodeURIComponent(contentType)}`
    });
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange} >
        <DialogContent className="max-w-lg mx-auto p-0 bg-white dark:bg-gray-900 border-none shadow-none">
          <div className={getCombinedClasses('background.card', 'rounded-2xl shadow-2xl p-6 w-full max-w-lg border border-emerald-500/10 relative bg-white dark:bg-gray-900')}>
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-white text-xl"
              onClick={() => onOpenChange(false)}
              aria-label="Close"
              type="button"
            >
            </button>
            <div className="flex flex-col items-center mb-6">
              <img
                src="/src/assets/book.png" 
                alt="EduGen Logo"
                className="w-12 h-12 rounded-lg shadow-lg bg-gradient-to-br from-white/80 to-emerald-100 p-2 dark:bg-gradient-to-br dark:from-white/60 dark:to-emerald-200 border border-white/70 dark:border-white/20 mb-2"
              />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent mb-1">Generate Content</h1>
              {prompt && <p className="text-gray-600 dark:text-gray-300 text-sm text-center max-w-sm truncate">for: {prompt}</p>}
            </div>
            
            <DialogHeader className="hidden">{/* Hide original header */}</DialogHeader>
            <DialogTitle className={getCombinedClasses('text.primary', '')}>Customize Your Learning Experience</DialogTitle>
            <br></br>
            <DialogDescription className={getCombinedClasses('text.secondary', '')}>
              Choose the level of explanation and content type that best fits your needs.
            </DialogDescription>
            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <label htmlFor="level" className={getCombinedClasses('text.primary', 'text-sm font-medium')}>
                  Learning Level
                </label>
                <Select value={level} onValueChange={setLevel} >
                  <SelectTrigger className={getCombinedClasses('background.input', 'h-10 text-base border-emerald-500/20 focus:border-emerald-500/40 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-white dark:bg-gray-800')}>
                    <SelectValue placeholder="Select a level" />
                  </SelectTrigger >
                  <SelectContent className="bg-white dark:bg-gray-800">
                    <SelectGroup className={getCombinedClasses('background.card', 'shadow-md text-gray-900 dark:text-white bg-white dark:bg-gray-800')}>
                      <SelectLabel>Learning Levels</SelectLabel>
                      <SelectItem value="explain-like-im-5">Explain Like I'm 5</SelectItem>
                      <SelectItem value="school-kid">School Kid</SelectItem>
                      <SelectItem value="high-school">High School</SelectItem>
                      <SelectItem value="graduate-student">Graduate Student</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="contentType" className={getCombinedClasses('text.primary', 'text-sm font-medium')}>
                  Content Type
                </label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger className={getCombinedClasses('background.input', 'h-10 text-base border-emerald-500/20 focus:border-emerald-500/40 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-white dark:bg-gray-800')}>
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800">
                    <SelectGroup className={getCombinedClasses('background.card', 'shadow-md text-gray-900 dark:text-white bg-white dark:bg-gray-800')}>
                      <SelectLabel>Content Types</SelectLabel>
                      <SelectItem value="concise">Concise - Quick Reads</SelectItem>
                      <SelectItem value="detailed">Long Form - Detailed</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => onOpenChange(false)} className={getCombinedClasses('text.primary', 'w-full sm:w-auto')}>
                Cancel
              </Button>
              <Button 
                onClick={handleGenerate} 
                disabled={!level || !contentType}
                className="bg-emerald-500 hover:bg-emerald-600 text-white w-full sm:w-auto rounded-xl shadow-md"
              >
                Create Learning Website
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
