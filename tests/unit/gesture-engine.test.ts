import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as THREE from 'three';
import { GestureEngine } from '../../src/gestures/gesture-engine';
import { CardManager } from '../../src/scene/card-manager';
import { AudioManager } from '../../src/core/audio/audio-manager';

// Mock dependencies
const mockRenderer = {
    xr: {
        getReferenceSpace: () => ({})
    }
} as any;

const mockCamera = new THREE.PerspectiveCamera();
const mockScene = new THREE.Scene();
const mockAudioManager = {
    playHoverSound: vi.fn(),
    playSparkSound: vi.fn(),
    playMatchSound: vi.fn()
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
            };
        }) as any;

        cardManager = new CardManager(mockScene, mockAudioManager);
        gestureEngine = new GestureEngine(mockRenderer, mockCamera, cardManager);
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
