import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as THREE from 'three';
import { GestureEngine } from '../../src/gestures/gesture-engine';
import { CardManager } from '../../src/scene/card-manager';
import { AudioManager } from '../../src/audio/audio-manager';

// Mock dependencies
const mockRenderer = {
    xr: {
        getReferenceSpace: () => ({})
    }
} as any;


const mockScene = new THREE.Scene();
const mockAudioManager = {
    play: vi.fn(),
    load: vi.fn(),
    playHoverSound: vi.fn(),
    playMatchSound: vi.fn(),
    playSwipeSound: vi.fn(),
} as unknown as AudioManager;

describe('GestureEngine', () => {
    let gestureEngine: GestureEngine;
    let cardManager: CardManager;

    beforeEach(() => {
        // Mock Canvas API
        HTMLCanvasElement.prototype.getContext = vi.fn(() => {
            return {
                fillStyle: '',
                fillRect: vi.fn(),
                textAlign: '',
                font: '',
                fillText: vi.fn(),
                strokeStyle: '',
                lineWidth: 0,
                beginPath: vi.fn(),
                moveTo: vi.fn(),
                lineTo: vi.fn(),
                stroke: vi.fn(),
                arc: vi.fn(),
                fill: vi.fn(),
                save: vi.fn(),
                restore: vi.fn(),
                clip: vi.fn(),
                drawImage: vi.fn(),
            };
        }) as any;

        cardManager = new CardManager(mockScene, mockAudioManager);
        gestureEngine = new GestureEngine(mockRenderer, cardManager, mockAudioManager);
    });

    it('should detect swipe based on velocity', () => {
        const triggerSpy = vi.spyOn(gestureEngine, 'triggerGesture');

        // Mock XRFrame and InputSource
        const mockFrame = {
            session: { inputSources: [{ targetRaySpace: {} }] },
            getPose: () => ({
                transform: {
                    position: new THREE.Vector3(0, 0, 0),
                    orientation: new THREE.Quaternion()
                }
            })
        } as any;

        // First frame - set last position
        gestureEngine.update(mockFrame);

        // Second frame - move fast to right
        mockFrame.getPose = () => ({
            transform: {
                position: new THREE.Vector3(0.5, 0, 0), // Large move
                orientation: new THREE.Quaternion()
            }
        });

        gestureEngine.update(mockFrame);

        expect(triggerSpy).toHaveBeenCalledWith('swipeRight');
    });
});
