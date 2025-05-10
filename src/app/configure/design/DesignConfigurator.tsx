'use client';

// bg-blue-950 border-blue-950
// bg-zinc-900 border-zinc-900
// bg-rose-950 border-rose-950

import HandleComponent from '@/components/HandleComponent';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BASE_PRICE } from '@/config/products';
import { useUploadThing } from '@/lib/uploadthing';
import { cn, formatPrice } from '@/lib/utils';
import { COLORS, FINISHES, MATERIALS, MODELS } from '@/validator/optionValidator';
import { Description, Label as HeadlessLabel, Radio, RadioGroup } from '@headlessui/react';
import { useMutation } from '@tanstack/react-query';
import { ArrowRight, Check, ChevronsUpDown } from 'lucide-react';
import NextImage from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { Rnd } from 'react-rnd';
import { toast } from 'sonner';
import { saveConfig as _saveConfig, SaveConfigArgs } from './actions';

type DesignConfiguratorProps = {
  configId: string;
  imageUrl: string;
  imageDimensions: { width: number; height: number };
};

function base64ToBlob(base64: string, mimeType: string) {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

function DesignConfigurator({ configId, imageUrl, imageDimensions }: DesignConfiguratorProps) {
  const [options, setOptions] = useState<
    {
      color: typeof COLORS[number];
      model: typeof MODELS.options[number];
      material: (typeof MATERIALS.options)[number];
      finish: (typeof FINISHES.options)[number];
    }
  >({
    color: COLORS[0],
    model: MODELS.options[0],
    material: MATERIALS.options[0],
    finish: FINISHES.options[0],
  });

  const [renderedDimension, setRenderedDimension] = useState({
    width: imageDimensions.width / 4,
    height: imageDimensions.height / 4,
  });
  const [renderedPosition, setRenderedPosition] = useState({ x: 150, y: 205 });

  const phoneCaseRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { startUpload } = useUploadThing('imageUploader');
  const router = useRouter();

  const { mutate: saveConfig } = useMutation({
    mutationKey: ['save-config'],
    mutationFn: async (args: SaveConfigArgs) => {
      await Promise.all([saveConfiguration(), _saveConfig(args)]);
    },
    onError: () => {
      toast.error('Something went wrong', {
        description: 'There was an error on our end. Please try again.',
      });
    },
    onSuccess: () => {
      router.push(`/configure/preview/?id=${configId}`);
    },
  });

  async function saveConfiguration() {
    try {
      const { left: caseLeft, top: caseTop, width, height } = phoneCaseRef.current!
        .getBoundingClientRect();
      const { left: containerLeft, top: containerTop } = containerRef.current!
        .getBoundingClientRect();

      const leftOffset = caseLeft - containerLeft;
      const topOffset = caseTop - containerTop;

      const actualX = renderedPosition.x - leftOffset;
      const actualY = renderedPosition.y - topOffset;

      const canvas = document.createElement('canvas');
      canvas.width = width, canvas.height = height;
      const ctx = canvas.getContext('2d');

      const userImage = new Image();
      userImage.crossOrigin = 'anonymous';
      userImage.src = imageUrl;
      await new Promise(resolve => userImage.onload = resolve);
      ctx?.drawImage(
        userImage,
        actualX,
        actualY,
        renderedDimension.width,
        renderedDimension.height
      );

      const base64 = canvas.toDataURL();
      const base64Data = base64.split(',')[1];

      const blob = base64ToBlob(base64Data, 'image/png');
      const file = new File([blob], 'filename.png', { type: 'image/png' });

      await startUpload([file], { configId });
    } catch (error) {
      toast.error('Something went wrong', {
        description: 'There was a problem saving your config, please try again.',
      });
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 my-20 grid-rows-[37.5rem] gap-y-4">
      <div
        ref={containerRef}
        className="relative overflow-hidden col-span-2 max-w-4xl flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12"
      >
        <div className="relative w-60 bg-opacity-50 pointer-events-none aspect-[896/1831]">
          <AspectRatio
            ref={phoneCaseRef}
            ratio={896 / 1831}
            className="pointer-events-none relative z-50 aspect-[896/1831] w-full"
          >
            <NextImage
              alt="phone image"
              src="/phone-template.png"
              className="pointer-events-none z-50 select-none"
              fill
            />
          </AspectRatio>
          <div className="absolute z-40 inset-x-[3px] inset-y-px rounded-[32px] shadow-[0_0_0_99999px_rgba(229,231,235,0.6)]" />
          <div
            className={cn(
              'absolute inset-x-[3px] inset-y-px rounded-[32px]',
              `bg-${options.color.tw}`
            )}
          />
        </div>

        <Rnd
          default={{
            x: 150,
            y: 205,
            width: imageDimensions.width / 4,
            height: imageDimensions.height / 4,
          }}
          lockAspectRatio
          resizeHandleComponent={{
            bottomRight: <HandleComponent />,
            bottomLeft: <HandleComponent />,
            topRight: <HandleComponent />,
            topLeft: <HandleComponent />,
          }}
          className="absolute z-20 border-[3px] border-primary"
          onResizeStop={(_, __, ref, ___, { x, y }) => {
            setRenderedPosition({ x, y });
            setRenderedDimension({
              height: ref.offsetHeight,
              width: ref.offsetWidth,
            });
          }}
          onDragStop={(_, data) => setRenderedPosition({ x: data.x, y: data.y })}
        >
          <div className="relative h-full bg-black">
            <NextImage src={imageUrl} fill alt="your image" className="pointer-events-none" />
          </div>
        </Rnd>
      </div>

      <div className="col-span-full lg:col-span-1 flex flex-col bg-white">
        <ScrollArea className="relative flex-1" type="always">
          <div className="p-8 pb-12">
            <h2 className="tracking-tight font-bold text-3xl">Customize your case</h2>

            <div className="h-px bg-zinc-200 my-6" />

            <div className="relative mt-4 h-full flex flex-col justify-between">
              <div className="flex flex-col gap-6">
                <RadioGroup
                  value={options.color}
                  onChange={(val) => {
                    setOptions(prev => ({ ...prev, color: val }));
                  }}
                >
                  <Label>Color: {options.color.label}</Label>
                  <div className="mt-3 flex items-center space-x-3">
                    {COLORS.map(color => (
                      <Radio
                        key={color.label}
                        value={color}
                        className={({ focus, checked }) =>
                          cn(
                            'relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 active:ring-0 focus:ring-0 active:outline-none focus:outline-none border-2 border-transparent',
                            { [`border-${color.tw}`]: focus || checked }
                          )}
                      >
                        <span
                          className={cn(
                            `bg-${color.tw}`,
                            'size-8 rounded-full border border-black border-opacity-10 '
                          )}
                        />
                      </Radio>
                    ))}
                  </div>
                </RadioGroup>

                <div className="relative flex flex-col gap-3">
                  <Label>Model</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" role="combobox" className="w-full justify-between">
                        {options.model.label}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {MODELS.options.map(model => (
                        <DropdownMenuItem
                          key={model.label}
                          className={cn(
                            'flex text-sm gap-1 items-center p-1.5 cursor-default hover:bg-zinc-100',
                            { 'bg-zinc-100': model.label === options.model.label }
                          )}
                          onClick={() => {
                            setOptions(prev => ({ ...prev, model }));
                          }}
                        >
                          <Check
                            className={cn(
                              ' size-4 mr-2',
                              model.label !== options.model.label && 'invisible'
                            )}
                          />
                          {model.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {[MATERIALS, FINISHES].map(({ name, options: selectableOptions }) => (
                  <RadioGroup
                    key={name}
                    value={options[name]}
                    onChange={(val) => setOptions(prev => ({ ...prev, [name]: val }))}
                  >
                    <Label>{name.slice(0, 1).toUpperCase() + name.slice(1)}</Label>
                    <div className="mt-3 space-y-4">
                      {selectableOptions.map(option => (
                        <Radio
                          key={option.value}
                          value={option}
                          className={({ checked, focus }) =>
                            cn(
                              'relative block cursor-pointer rounded-lg bg-white px-6 py-4 shadow-sm border-2 border-zinc-200 focus:outline-none ring-0 focus:ring-0 outline-none sm:flex sm:justify-between',
                              {
                                'border-primary': checked || focus,
                              }
                            )}
                        >
                          <span className="flex items-center">
                            <span className="flex flex-col text-sm">
                              <HeadlessLabel as="span" className="font-medium text-gray-900">
                                {option.label}
                              </HeadlessLabel>

                              {option.description && (
                                <Description as="span" className="text-gray-500">
                                  <span className="block sm:inline">{option.description}</span>
                                </Description>
                              )}
                            </span>
                          </span>

                          <Description
                            as="span"
                            className="mt-2 flex text-sm sm:ml-4 sm:mt-0 sm:flex-col sm:text-right"
                          >
                            <span className="font-medium text-gray-900">
                              {formatPrice(option.price / 100)}
                            </span>
                          </Description>
                        </Radio>
                      ))}
                    </div>
                  </RadioGroup>
                ))}
              </div>
            </div>
          </div>
          <div
            aria-hidden="true"
            className="absolute mx-8 z-10 inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white pointer-events-none"
          />
        </ScrollArea>

        <div className="mt-2 px-8 h-16 bg-white">
          <div className="h-px bg-zinc-200" />
          <div className="flex gap-6 items-center justify-between h-[calc(100%-1px)] ">
            <p className="font-medium whitespace-nowrap">
              {formatPrice((BASE_PRICE + options.finish.price + options.material.price) / 100)}
            </p>
            <Button
              size="sm"
              className="w-full max-w-72"
              onClick={() =>
                saveConfig({
                  configId,
                  color: options.color.value,
                  finish: options.finish.value,
                  material: options.material.value,
                  model: options.model.value,
                })}
            >
              Continue
              <ArrowRight className="size-4 ml-1.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default DesignConfigurator;
